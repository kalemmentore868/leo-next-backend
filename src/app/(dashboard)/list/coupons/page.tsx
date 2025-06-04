"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase"; // adjust if needed
import { format } from "date-fns";

/* ------------------------------------------------------------------ enums */
export enum CouponTypes {
  SUBSCRIPTION = "subscription",
  SPECIALS = "specials",
  FEATURED = "featured",
  MESSAGE_BLAST = "message_blast",
}

export enum CouponDiscountType {
  PERCENTAGE = "percentage",
  FLAT = "flat",
}

interface Coupon {
  id: string;
  coupon_type: CouponTypes;
  type: CouponDiscountType;
  name: string;
  is_active: boolean;
  amount: number;
  expires_on: Timestamp;
}

/* ------------------------------------------------ form default state */
const defaultFormState = {
  name: "",
  coupon_type: CouponTypes.SUBSCRIPTION,
  type: CouponDiscountType.PERCENTAGE,
  amount: "0",
  expires_on: "", // ISO date yyyy-mm-dd
  is_active: true,
};

type FormState = typeof defaultFormState;

/* ================================================================ */
const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({ ...defaultFormState });
  const [usageMap, setUsageMap] = useState<Record<string, number>>({});

  /* ------------------------------ realtime listener */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Coupons"), (snap) => {
      setCoupons(
        snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<Coupon, "id">) } as Coupon)
        )
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // bail early if coupons haven't loaded yet
    if (!coupons.length) return;

    // create an onSnapshot for each coupon → keeps counts live
    const unsubs = coupons.map((c) =>
      onSnapshot(
        query(
          collection(db, "Orders"),
          where("coupon_id", "==", c.id),
          where("status", "in", ["completed", "active"]) // assuming you want only completed orders
        ),
        (snap) => {
          setUsageMap((prev) => ({ ...prev, [c.id]: snap.size }));
        }
      )
    );

    // cleanup
    return () => unsubs.forEach((u) => u());
  }, [coupons]);

  /* -------------------------------- toggle active */
  const toggleActive = async (c: Coupon) => {
    await updateDoc(doc(db, "Coupons", c.id), { is_active: !c.is_active });
  };

  /* -------------------------------- form helpers */
  const handleChange = (k: keyof FormState, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const resetForm = () => setForm({ ...defaultFormState });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: Number(form.amount),
      expires_on: Timestamp.fromDate(new Date(form.expires_on)),
    };
    await addDoc(collection(db, "Coupons"), payload);
    setShowModal(false);
    resetForm();
  };

  /* ============================================================ */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      {/* header ---------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Coupons</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
        >
          Add New
        </button>
      </div>

      {/* table ----------------------------------------------------- */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg text-sm">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              {[
                "Name",
                "Type",
                "Active?",
                "Expires",
                "Coupon Group",
                "Amount",
                "Times Used",
              ].map((h) => (
                <th key={h} className="p-2 first:pl-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr key={c.id} className={i % 2 ? "bg-gray-50" : "bg-gray-100"}>
                <td className="p-2 first:pl-4 max-w-[160px] truncate">
                  {c.name}
                </td>
                <td className="p-2 capitalize">{c.type}</td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={c.is_active}
                    onChange={() => toggleActive(c)}
                  />
                </td>
                <td className="p-2">{format(c.expires_on.toDate(), "PPP")}</td>
                <td className="p-2 capitalize">{c.coupon_type}</td>
                <td className="p-2">{c.amount}</td>
                <td className="p-2">{usageMap[c.id] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------------------------- modal --------------------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Coupon</h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 text-sm"
            >
              <input
                className="border px-3 py-2 rounded-md"
                placeholder="Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />

              {/* coupon group */}
              <select
                className="border px-3 py-2 rounded-md capitalize"
                value={form.coupon_type}
                onChange={(e) =>
                  handleChange("coupon_type", e.target.value as CouponTypes)
                }
              >
                {Object.values(CouponTypes).map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>

              {/* discount type */}
              <select
                className="border px-3 py-2 rounded-md capitalize"
                value={form.type}
                onChange={(e) =>
                  handleChange("type", e.target.value as CouponDiscountType)
                }
              >
                {Object.values(CouponDiscountType).map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="border px-3 py-2 rounded-md"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                min="0"
              />

              <input
                type="date"
                className="border px-3 py-2 rounded-md"
                value={form.expires_on}
                onChange={(e) => handleChange("expires_on", e.target.value)}
                required
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                />
                Active
              </label>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-3 py-1 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
