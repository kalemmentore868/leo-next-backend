/* src/app/(dashboard)/list/services/page.tsx
   Uses AdminService.getAllServices (+ optional approval toggle) */

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AdminService,
  AggregatedService,
  GetAllServicesParams,
} from "@/src/data/services/AdminService";
import { Product } from "@/src/types/Business";
import { getIdToken } from "firebase/auth";
import { auth } from "@/firebase";

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("No Firebase user");
  return getIdToken(user, /*forceRefresh*/ true);
}

/* -------------------------------------------------------------------------- */
/* component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ServicesPage() {
  /* UI state ----------------------------------------------------------------*/
  const [services, setServices] = useState<AggregatedService[]>([]);
  const [total, setTotal] = useState(0); // from API
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AggregatedService | null>(null);

  /* fetch -------------------------------------------------------------------*/
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params: GetAllServicesParams = {
        page,
        limit,
        search,
        type: "service",
      };
      const res = await AdminService.getAllServices(token, params);
      if (res) {
        setServices(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /* optimistic approval toggle ---------------------------------------------*/
  const toggleApprove = async (svc: AggregatedService) => {
    const newApproved = !svc.approved; // desired value
    try {
      // optimistic UI
      setServices((cur) =>
        cur.map((s) =>
          s.business_auth_id === svc.business_auth_id && s.index === svc.index
            ? { ...s, approved: !s.approved }
            : s
        )
      );

      const token = await getToken();
      /* you should expose PUT /admins/services/:id that updates { approved } */
      await AdminService.updateService(
        token,
        svc.index,
        svc.business_auth_id,
        newApproved,
        "service"
      );
    } catch (err) {
      console.error(err);
      // rollback on error
      setServices((cur) =>
        cur.map((s) =>
          s.business_auth_id === svc.business_auth_id && s.index === svc.index
            ? { ...s, approved: svc.approved }
            : s
        )
      );
    }
  };

  /* derived -----------------------------------------------------------------*/
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  /* render ------------------------------------------------------------------*/
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">
        Services
      </h1>

      {/* search box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          fetchServices();
        }}
        className="mb-4 w-full max-w-md"
      >
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full p-2 bg-transparent outline-none"
          />
          <button type="submit" className="hidden" />
        </div>
      </form>

      {/* table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 text-left">Approved</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">
                Business&nbsp;Auth&nbsp;ID
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  Loading…
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  No services found
                </td>
              </tr>
            ) : (
              services.map((svc, i) => (
                <tr
                  key={svc.business_auth_id + svc.index}
                  className={`${
                    i % 2 ? "bg-gray-100" : "bg-gray-50"
                  } hover:bg-gray-200 cursor-pointer`}
                  onClick={() => setSelected(svc)}
                >
                  <td
                    className="py-2 px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleApprove(svc);
                    }}
                  >
                    <input type="checkbox" checked={svc.approved} readOnly />
                  </td>
                  <td className="py-2 px-4">
                    <Image
                      src={svc.display_image_url || "/placeholder.png"}
                      alt={svc.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="py-2 px-4">{svc.name}</td>
                  <td className="py-2 px-4 truncate max-w-xs">
                    {svc.description}
                  </td>
                  <td className="py-2 px-4">${svc.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{svc.business_auth_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <nav>
            <ul className="inline-flex -space-x-px">
              {Array.from({ length: totalPages }, (_, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setPage(idx + 1)}
                    className={`px-3 py-2 leading-tight ${
                      page === idx + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    } border border-gray-300 hover:bg-gray-100 hover:text-blue-700`}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* modal ---------------------------------------------------------------*/}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Service details</h2>

            <Image
              src={selected.display_image_url || "/placeholder.png"}
              alt={selected.name}
              width={120}
              height={120}
              className="rounded-md mb-4 object-cover"
            />

            <p>
              <b>ID:</b> {selected.index}
            </p>
            <p>
              <b>Business Auth ID:</b> {selected.business_auth_id}
            </p>
            <p>
              <b>Name:</b> {selected.name}
            </p>
            <p>
              <b>Description:</b> {selected.description}
            </p>
            <p>
              <b>Price:</b> ${selected.price.toFixed(2)}
            </p>
            <p>
              <b>Approved:</b> {selected.approved ? "Yes" : "No"}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
