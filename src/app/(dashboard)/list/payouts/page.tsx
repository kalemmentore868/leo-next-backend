"use client";

import React, { useState, useEffect } from "react";
import {
  PayoutService,
  WalletBalance,
} from "@/src/data/services/PayoutService";
import { getToken } from "@/src/data/services/util";
import { useAuth } from "@/src/context/AuthProvider";

const PAGE_SIZE = 20;

export default function PayoutsPage() {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<WalletBalance | null>(null);
  const { admin } = useAuth();

  const fetchBalances = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) return;
    const resp = await PayoutService.getPending(token, page, PAGE_SIZE);
    if (resp) {
      setBalances(resp.data);
      setPages(resp.pages);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchBalances();
  }, [page]);

  const toggle = (auth_id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(auth_id) ? next.delete(auth_id) : next.add(auth_id);
      return next;
    });
  };

  const pay = async () => {
    const token = await getToken();
    if (!token) return;

    const items = balances
      .filter((b) => selected.has(b.auth_id))
      .map((b) => ({
        auth_id: b.auth_id,
        amount: b.current_balance,
        related_id: `${admin?.auth_id}`,
      }));
    if (items.length === 0) return;

    setLoading(true);
    const ok = await PayoutService.execute(token, items);
    setLoading(false);
    if (ok) {
      setSelected(new Set());
      fetchBalances();
      alert("Payouts executed!");
    } else {
      alert("Failed to execute payouts.");
    }
  };

  const openModal = (b: WalletBalance) => {
    setModalData(b);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Referral Payouts</h1>

      <button
        onClick={pay}
        disabled={selected.size === 0 || loading}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Processing…" : `Pay ${selected.size} business(es)`}
      </button>

      <div className="overflow-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">
                <input
                  type="checkbox"
                  onChange={() => balances.forEach((b) => toggle(b.auth_id))}
                  checked={
                    selected.size === balances.length && balances.length > 0
                  }
                />
              </th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Contact Email</th>
              <th className="p-2 text-left">Current Balance</th>
              <th className="p-2 text-left">Last Payout</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading…
                </td>
              </tr>
            ) : balances.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No payouts pending.
                </td>
              </tr>
            ) : (
              balances.map((b) => {
                const profile = b.referral_profile;
                const name = profile?.legal_name ?? "—";
                const email = profile?.contact_email ?? "—";
                return (
                  <tr key={b.auth_id} className="border-t">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.has(b.auth_id)}
                        onChange={() => toggle(b.auth_id)}
                      />
                    </td>
                    <td className="p-2">{name}</td>
                    <td className="p-2">{email}</td>
                    <td className="p-2">TT${b.current_balance}</td>
                    <td className="p-2">
                      {b.last_payout_at
                        ? new Date(b.last_payout_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => openModal(b)}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Show Bank Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          disabled={page === pages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for bank details */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
            <p className="mb-2">
              <strong>Name:</strong> {modalData.referral_profile?.legal_name}
            </p>
            <p className="mb-2">
              <strong>Amount:</strong> TT${modalData.current_balance}
            </p>
            <h3 className="font-medium mt-4 mb-2">Account Info</h3>
            <p>
              <strong>Account Name:</strong>{" "}
              {modalData.referral_profile?.bank?.account_name}
            </p>
            <p>
              <strong>Account Number:</strong>{" "}
              {modalData.referral_profile?.bank?.account_number}
            </p>
            <p>
              <strong>Transit Number:</strong>{" "}
              {modalData.referral_profile?.bank?.transit_number || "—"}
            </p>
            <p>
              <strong>Bank Name:</strong>{" "}
              {modalData.referral_profile?.bank?.bank_name}
            </p>
            <p>
              <strong>Branch:</strong> {modalData.referral_profile?.bank.branch}
            </p>
            <p>
              <strong>Account Type:</strong>{" "}
              {modalData.referral_profile?.bank?.account_type}
            </p>
            <p>
              <strong>Category:</strong> {modalData.referral_profile?.bank.type}{" "}
              bank account
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
