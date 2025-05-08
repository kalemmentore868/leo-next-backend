// src/app/(dashboard)/list/users/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { UserService, PaginatedUsers } from "@/src/data/services/UserService";
import { User } from "@/src/types/User";
import { getToken } from "@/src/data/services/util"; // helper that wraps firebase.getIdToken()

const USERS_PER_PAGE = 10;

export default function UsersPage() {
  /* ------------------ state */
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  /* ------------------ fetch */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await UserService.getAllUsers(token!, {
        page,
        limit: USERS_PER_PAGE,
        search,
      });
      if (res) {
        setUsers(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* run whenever page OR search changes */
  useEffect(() => {
    fetchUsers();
  }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / USERS_PER_PAGE)),
    [total]
  );

  /* ------------------ render */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Users</h1>

      {/* --- search bar --- */}
      <form
        className="mb-4 max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
        }}
      >
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            placeholder="Search users…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full p-2 bg-transparent outline-none"
          />
        </div>
      </form>

      {/* --- table --- */}
      {loading ? (
        <p className="text-center py-10">Loading…</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Profile</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.auth_id}
                  className={`${
                    i % 2 ? "bg-gray-100" : "bg-gray-50"
                  } hover:bg-gray-200 cursor-pointer`}
                  onClick={() => setSelected(u)}
                >
                  <td className="py-2 px-4">{u.auth_id}</td>
                  <td className="py-2 px-4">
                    <div className="w-10 h-10 relative">
                      <Image
                        src={u.display_picture_url || "/avatar.png"}
                        alt={u.username}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {u.first_name && u.last_name
                      ? `${u.first_name} ${u.last_name}`
                      : "Nil"}
                  </td>
                  <td className="py-2 px-4">{u.username || "Nil"}</td>
                  <td className="py-2 px-4">{u.email || "Nil"}</td>
                  <td className="py-2 px-4">
                    {["business", "customer", "admin"]
                      .filter((r) => (u.role as any)[r])
                      .join(" / ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- pagination --- */}
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-2 border ${
              p === page
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* --- modal --- */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <Image
              src={selected.display_picture_url || "/avatar.png"}
              alt={selected.username}
              width={100}
              height={100}
              className="rounded-full mb-4"
            />
            <p>
              <b>ID:</b> {selected.auth_id}
            </p>
            <p>
              <b>Name:</b>{" "}
              {selected.first_name && selected.last_name
                ? `${selected.first_name} ${selected.last_name}`
                : "Nil"}
            </p>
            <p>
              <b>Username:</b> {selected.username || "Nil"}
            </p>
            <p>
              <b>Email:</b> {selected.email}
            </p>
            <p>
              <b>Role:</b>{" "}
              {["business", "customer", "admin"]
                .filter((r) => (selected.role as any)[r])
                .join(" / ")}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
