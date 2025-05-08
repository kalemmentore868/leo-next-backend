// src/app/(dashboard)/list/reviews/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import {
  AdminService,
  AggregatedReview,
  GetAllReviewsParams,
} from "@/src/data/services/AdminService";
import { auth } from "@/firebase";
import { getIdToken } from "firebase/auth";

/* ------------------------------------------------ helpers */
const getToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No Firebase user");
  return getIdToken(user, true);
};

function truncate(str = "", n = 6) {
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

/* ------------------------------------------------ component */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AggregatedReview[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSel] = useState<AggregatedReview | null>(null);

  /* fetch list */
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params: GetAllReviewsParams = { page, limit, search };
      const res = await AdminService.getAllReviews(token, params);
      if (res) {
        setReviews(res.data);
        setTotal(res.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  /* toggle approval (checkbox) */
  const toggle = async (rv: AggregatedReview) => {
    const desired = !rv.approved;
    // optimistic
    setReviews((cur) =>
      cur.map((x) => (x._id === rv._id ? { ...x, approved: desired } : x))
    );
    try {
      const token = await getToken();
      await AdminService.updateReview(token, rv._id, desired);
    } catch (err) {
      console.error(err);
      // rollback
      setReviews((cur) =>
        cur.map((x) => (x._id === rv._id ? { ...x, approved: rv.approved } : x))
      );
    }
  };

  const pages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  /* ------------------------------------------------ UI */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Reviews</h1>

      {/* search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          fetchReviews();
        }}
        className="mb-4 max-w-md"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews…"
          className="w-full p-2 border rounded"
        />
      </form>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-2">Approved</th>
              <th className="p-2">Review&nbsp;ID</th>
              <th className="p-2">Business</th>
              <th className="p-2">User</th>
              <th className="p-2">Comment</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading…
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  No reviews
                </td>
              </tr>
            ) : (
              reviews.map((rv, i) => (
                <tr
                  key={rv._id}
                  className={i % 2 ? "bg-gray-100" : "bg-gray-50"}
                  onClick={() => setSel(rv)}
                >
                  <td
                    className="p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(rv);
                    }}
                  >
                    <input type="checkbox" checked={rv.approved} readOnly />
                  </td>
                  <td className="p-2">{truncate(rv._id, 6)}</td>
                  <td className="p-2">{truncate(rv.business_name, 25)}</td>
                  <td className="p-2">{truncate(rv.user_name, 25)}</td>
                  <td className="p-2 max-w-xs truncate">{rv.comment}</td>
                  <td className="p-2 flex gap-0.5">
                    {Array.from({ length: rv.rating }, (_, k) => (
                      <FaStar key={k} className="text-yellow-500" />
                    ))}
                  </td>
                  <td className="p-2">
                    {new Date(rv.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {pages > 1 && (
        <div className="mt-4 space-x-1">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border ${
                page === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Review details</h2>
            <p>
              <b>ID:</b> {selected._id}
            </p>
            <p>
              <b>Business:</b> {selected.business_name}
            </p>
            <p>
              <b>User:</b> {selected.user_name}
            </p>
            <p>
              <b>Date:</b> {new Date(selected.created_at).toLocaleString()}
            </p>
            <p>
              <b>Comment:</b> {selected.comment}
            </p>
            <p>
              <b>Rating:</b> {selected.rating}
            </p>
            <p>
              <b>Approved:</b> {selected.approved ? "Yes" : "No"}
            </p>

            <button
              onClick={() => setSel(null)}
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
