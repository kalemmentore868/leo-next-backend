"use client";
import { AdminService, AuthUserRow } from "@/src/data/services/AdminService";
import { getToken } from "@/src/data/services/util";
import React, { useState, useEffect } from "react";

export default function AuthUsersPage() {
  const [rows, setRows] = useState<AuthUserRow[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPage = async (pageToken?: string) => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) return;

        const data = await AdminService.getAllAuthUsers(token);
        if (data) {
          setRows(data.users);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPage(); // first page
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {rows?.length} Users Have Signed Up
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded text-sm">
          <thead className="bg-blue-600 text-white text-left">
            <tr>
              <th className="p-2">Date&nbsp;Created</th>
              <th className="p-2">Email</th>
              <th className="p-2">Last&nbsp;Login</th>
              <th className="p-2">UID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.uid} className="even:bg-gray-50">
                <td className="p-2">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
                <td className="p-2">{u.email ?? "—"}</td>
                <td className="p-2">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "—"}
                </td>
                <td className="p-2 font-mono truncate max-w-xs">{u.uid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
