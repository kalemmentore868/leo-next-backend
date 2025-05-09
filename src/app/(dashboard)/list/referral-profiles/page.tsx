"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ReferralProfileService } from "@/src/data/services/ReferralProfileService";
import { ReferralProfile } from "@/src/types/ReferralProfile";
import { getToken } from "@/src/data/services/util";

const PAGE_SIZE = 10;
const STATUS_OPTIONS: Array<ReferralProfile["enrollment_status"] | "all"> = [
  "all",
  "pending",
  "approved",
  "rejected",
];

export default function ReferralProfilesPage() {
  const [profiles, setProfiles] = useState<ReferralProfile[]>([]);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<
    ReferralProfile["enrollment_status"] | "all"
  >("all");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const statusParam = filterStatus === "all" ? undefined : filterStatus;
      const resp = await ReferralProfileService.getAll(
        token,
        page,
        PAGE_SIZE,
        statusParam
      );
      if (resp) {
        setProfiles(resp.data);
        setTotalPages(resp.pages);
      }
    } catch (err) {
      console.error("Error fetching referral profiles:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleStatusChange = async (
    auth_id: string,
    newStatus: ReferralProfile["enrollment_status"]
  ) => {
    try {
      const token = await getToken();
      if (!token) return;

      const updates: Partial<ReferralProfile> = {
        enrollment_status: newStatus,
      };
      // set timestamp fields
      const now = new Date();
      if (newStatus === "approved") {
        updates.approved_at = now;
        updates.rejected_at = null;
      } else if (newStatus === "rejected") {
        updates.rejected_at = now;
        updates.approved_at = null;
      }

      const updated = await ReferralProfileService.updateStatus(
        token,
        auth_id,
        updates as any
      );
      if (updated) {
        setProfiles((prev) =>
          prev.map((p) => (p.auth_id === auth_id ? updated : p))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Referral Profiles</h1>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Filter status:</label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as any);
            setPage(1);
          }}
          className="px-2 py-1 border rounded"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Enrolled</th>
              <th className="p-2 text-left">Approved</th>
              <th className="p-2 text-left">Rejected</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : profiles.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={6}>
                  No profiles found.
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr key={p.auth_id} className="border-t">
                  <td className="p-2">{p.legal_name}</td>
                  <td className="p-2">{p.contact_email}</td>
                  <td className="p-2">
                    <select
                      value={p.enrollment_status}
                      onChange={(e) =>
                        handleStatusChange(p.auth_id, e.target.value as any)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    {new Date(p.enrolled_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {p.approved_at
                      ? new Date(p.approved_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2">
                    {p.rejected_at
                      ? new Date(p.rejected_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((x) => Math.max(1, x - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((x) => Math.min(totalPages, x + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
