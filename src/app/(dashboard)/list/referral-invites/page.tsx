"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ReferralInviteService } from "@/src/data/services/ReferralInvitesService";
import { ReferralInvite } from "@/src/types/ReferralInvites";
import { getToken } from "@/src/data/services/util";

const PAGE_SIZE = 10;

export default function ReferralInvitesPage() {
  const [invites, setInvites] = useState<ReferralInvite[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const resp = await ReferralInviteService.getAll(token, page, PAGE_SIZE);
      if (resp) {
        setInvites(resp.data);
        setTotalPages(resp.pages);
      }
    } catch (err) {
      console.error("Error fetching referral invites:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Referral Invites</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Invite Code</th>
              <th className="p-2 text-left">Referrer Email</th>
              <th className="p-2 text-left">Invitee Email</th>
              <th className="p-2 text-left">Invitee Auth ID</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Sent At</th>
              <th className="p-2 text-left">Accepted At</th>
              <th className="p-2 text-left">Expires At</th>
              <th className="p-2 text-left">Rewarded At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={9}>
                  Loading…
                </td>
              </tr>
            ) : invites.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={9}>
                  No referral invites found.
                </td>
              </tr>
            ) : (
              invites.map((inv) => (
                <tr key={inv._id} className="border-t">
                  <td className="p-2">{inv.invite_code}</td>
                  <td className="p-2">{inv.referrer_id}</td>
                  <td className="p-2">{inv.invitee_email}</td>
                  <td className="p-2">{inv.invitee_auth_id || "—"}</td>
                  <td className="p-2 capitalize">{inv.status}</td>
                  <td className="p-2">
                    {new Date(inv.sent_at).toLocaleString().split(",")[0]}
                  </td>
                  <td className="p-2">
                    {inv.accepted_at
                      ? new Date(inv.accepted_at).toLocaleString().split(",")[0]
                      : "—"}
                  </td>
                  <td className="p-2">
                    {new Date(inv.expires_at).toLocaleString().split(",")[0]}
                  </td>
                  <td className="p-2">
                    {inv.rewarded_at
                      ? new Date(inv.rewarded_at).toLocaleString().split(",")[0]
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
