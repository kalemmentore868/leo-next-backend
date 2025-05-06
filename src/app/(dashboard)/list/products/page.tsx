/* src/app/(dashboard)/list/products/page.tsx */

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AdminService,
  AggregatedService as AggregatedProduct, // same shape
  GetAllServicesParams, // reuse
} from "@/src/data/services/AdminService";
import { auth } from "@/firebase";
import { getIdToken } from "firebase/auth";

/* helpers ------------------------------------------------------------------*/
async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("No Firebase user");
  return getIdToken(user, true);
}

/* component ----------------------------------------------------------------*/
export default function ProductsPage() {
  const [products, setProducts] = useState<AggregatedProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AggregatedProduct | null>(null);

  /* fetch list -------------------------------------------------------------*/
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params: GetAllServicesParams = {
        page,
        limit,
        search,
        type: "product",
      };
      const res = await AdminService.getAllServices(token, params);
      if (res) {
        setProducts(res.data);
        setTotal(res.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* optimistic approval toggle --------------------------------------------*/
  const toggleApprove = async (prd: AggregatedProduct) => {
    const newApproved = !prd.approved; // desired value

    // optimistic UI ---------------------------------------------------------
    setProducts((curr) =>
      curr.map((p) =>
        p.business_auth_id === prd.business_auth_id && p.index === prd.index
          ? { ...p, approved: newApproved }
          : p
      )
    );

    try {
      const token = await getToken();
      await AdminService.updateService(
        token,
        prd.index,
        prd.business_auth_id,
        newApproved, // 👈 send it
        "product"
      );
    } catch (err) {
      console.error(err);
      // rollback on failure --------------------------------------------------
      setProducts((curr) =>
        curr.map((p) =>
          p.business_auth_id === prd.business_auth_id && p.index === prd.index
            ? { ...p, approved: prd.approved }
            : p
        )
      );
    }
  };

  /* derived ----------------------------------------------------------------*/
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  /* render -----------------------------------------------------------------*/
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Products</h1>

      {/* search -------------------------------------------------------------*/}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          fetchProducts();
        }}
        className="mb-4 w-full max-w-md"
      >
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full p-2 bg-transparent outline-none"
          />
          <button type="submit" className="hidden" />
        </div>
      </form>

      {/* table --------------------------------------------------------------*/}
      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 text-left">Approved</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Business Auth ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((prd, i) => (
                <tr
                  key={prd.business_auth_id + prd.index}
                  className={`${
                    i % 2 ? "bg-gray-100" : "bg-gray-50"
                  } hover:bg-gray-200 cursor-pointer`}
                  onClick={() => setSelected(prd)}
                >
                  <td
                    className="py-2 px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleApprove(prd);
                    }}
                  >
                    <input type="checkbox" checked={prd.approved} readOnly />
                  </td>
                  <td className="py-2 px-4">
                    <Image
                      src={prd.display_image_url || "/placeholder.png"}
                      alt={prd.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="py-2 px-4">{prd.name}</td>
                  <td className="py-2 px-4 truncate max-w-xs">
                    {prd.description}
                  </td>
                  <td className="py-2 px-4">${prd.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{prd.business_auth_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination ---------------------------------------------------------*/}
      {totalPages > 1 && (
        <div className="mt-4">
          <ul className="inline-flex -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-2 leading-tight ${
                    page === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  } border border-gray-300 hover:bg-gray-100 hover:text-blue-700`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* modal --------------------------------------------------------------*/}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Product details</h2>

            <Image
              src={selected.display_image_url || "/placeholder.png"}
              alt={selected.name}
              width={120}
              height={120}
              className="rounded-md mb-4 object-cover"
            />

            <p>
              <b>Index:</b> {selected.index}
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
