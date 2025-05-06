"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { UserService, PaginatedUsers } from "@/src/data/services/UserService";
import { User } from "@/src/types/User"; // <- make sure paths match
import { getToken } from "@/src/data/services/util"; // <- your helper that calls firebase.getIdToken()

const USERS_PER_PAGE = 10;

const UsersPage = () => {
  /* ------------------------------------------------------------------ state */
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  /* -------------------------------------------------------- fetch & helpers */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const data = await UserService.getAllUsers(token, {
        page,
        limit: USERS_PER_PAGE,
        search,
      });

      if (data) {
        setUsers(data.data);
        setTotal(data.total);
      }
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  };

  // request fresh data whenever page / search changes
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // search triggers fetch via onSearch submit

  /* ---------------------------------------------- derived / memoised values */
  const totalPages = useMemo(
    () => Math.ceil(total / USERS_PER_PAGE) || 1,
    [total]
  );

  /* ------------------------------------------------------------------ jsx */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Users</h1>

      {/* ------------ search ------------ */}
      <form
        className="mb-4 w-full max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1); // reset to first page
          fetchUsers(); // trigger fetch with current search
        }}
      >
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 bg-transparent outline-none"
          />
        </div>
      </form>

      {/* ------------ table ------------ */}
      <div className="overflow-x-auto w-full">
        {loading ? (
          <p className="text-center p-8">Loading…</p>
        ) : (
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white">
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
                  } hover:bg-gray-200 cursor-pointer transition-colors`}
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
        )}
      </div>

      {/* ------------ pagination ------------ */}
      <div className="mt-4">
        <ul className="inline-flex -space-x-px">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p}>
              <button
                onClick={() => setPage(p)}
                disabled={p === page}
                className={`px-3 py-2 leading-tight border border-gray-300 ${
                  p === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-700"
                }`}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ------------ modal ------------ */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <Image
              src={selected.display_picture_url || "/avatar.png"}
              alt={selected.username}
              width={100}
              height={100}
              className="rounded-full mb-4"
            />
            <p>
              <strong>ID:</strong> {selected.auth_id}
            </p>
            <p>
              <strong>Name:</strong>{" "}
              {selected.first_name && selected.last_name
                ? `${selected.first_name} ${selected.last_name}`
                : "Nil"}
            </p>
            <p>
              <strong>Username:</strong> {selected.username || "Nil"}
            </p>
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {["business", "customer", "admin"]
                .filter((r) => (selected.role as any)[r])
                .join(" / ")}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
