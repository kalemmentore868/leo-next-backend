// src/app/(dashboard)/list/specials/page.tsx
"use client";

import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import {
  AdminService,
  GetAllSpecialsParams,
  AggregatedSpecial,
} from "@/src/data/services/AdminService";
import { auth } from "@/firebase";
import { getIdToken } from "firebase/auth";

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

const getToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No Firebase user");
  return getIdToken(user, /* forceRefresh */ true);
};

/* -------------------------------------------------------------------------- */
/* component                                                                  */
/* -------------------------------------------------------------------------- */

export default function SpecialsPage() {
  /* local UI state -------------------------------------------------------- */
  const [specials, setSpecials] = useState<AggregatedSpecial[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AggregatedSpecial | null>(null);

  /* ---------------------------------------------------------------------- */
  /* fetch list                                                             */
  /* ---------------------------------------------------------------------- */
  const fetchSpecials = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params: GetAllSpecialsParams = { page, limit, search };
      const res = await AdminService.getAllSpecials(token, params);
      if (res) {
        setSpecials(res.data);
        setTotal(res.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchSpecials();
  }, [fetchSpecials]);

  /* ---------------------------------------------------------------------- */
  /* status dropdown handler (optimistic)                                   */
  /* ---------------------------------------------------------------------- */
  const onStatusChange = async (
    e: SyntheticEvent<HTMLSelectElement>,
    sp: AggregatedSpecial
  ) => {
    e.stopPropagation();
    const newStatus = e.currentTarget.value as AggregatedSpecial["status"];

    // optimistic UI
    setSpecials((cur) =>
      cur.map((s) =>
        s.business_auth_id === sp.business_auth_id && s.index === sp.index
          ? { ...s, status: newStatus }
          : s
      )
    );

    try {
      const token = await getToken();
      await AdminService.updateSpecial(
        token,
        sp.index,
        sp.business_auth_id,
        newStatus
      );
      alert("Status updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
      // rollback
      setSpecials((cur) =>
        cur.map((s) =>
          s.business_auth_id === sp.business_auth_id && s.index === sp.index
            ? { ...s, status: sp.status }
            : s
        )
      );
    }
  };

  /* paging helpers */
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  /* ---------------------------------------------------------------------- */
  /* render                                                                 */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Specials</h1>

      {/* search bar -------------------------------------------------------- */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          fetchSpecials();
        }}
        className="mb-4 max-w-md"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search specials…"
          className="w-full p-2 border rounded"
        />
      </form>

      {/* table ------------------------------------------------------------- */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Business Auth ID</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  Loading…
                </td>
              </tr>
            ) : specials.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  No specials found
                </td>
              </tr>
            ) : (
              specials.map((sp, i) => (
                <tr
                  key={sp.business_auth_id + sp.index}
                  className={i % 2 ? "bg-gray-100" : "bg-gray-50"}
                  onClick={() => setSelected(sp)}
                >
                  {/* status dropdown */}
                  <td
                    className="py-2 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={sp.status}
                      className="border rounded px-1 py-0.5 text-sm"
                      onChange={(e) => onStatusChange(e, sp)}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </td>

                  <td className="p-2">
                    <Image
                      src={sp.image_url || "/placeholder.png"}
                      alt={sp.title}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="p-2">{sp.title}</td>
                  <td className="p-2 truncate max-w-xs">{sp.description}</td>
                  <td className="p-2">{sp.business_auth_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* simple paginator -------------------------------------------------- */}
      {totalPages > 1 && (
        <div className="mt-4 space-x-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* modal ------------------------------------------------------------- */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Special details</h2>

            <Image
              src={selected.image_url || "/placeholder.png"}
              alt={selected.title}
              width={120}
              height={120}
              className="rounded mb-4 object-cover"
            />

            <p>
              <b>Business Auth ID:</b> {selected.business_auth_id}
            </p>
            <p>
              <b>Title:</b> {selected.title}
            </p>
            <p>
              <b>Description:</b> {selected.description}
            </p>
            <p>
              <b>Status:</b> {selected.status}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
