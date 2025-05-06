// app/(admin)/businesses/page.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AdminService,
  GetAllBusinessesParams,
} from "@/src/data/services/AdminService";
import { Business } from "@/src/types/Business";
import { getToken } from "@/src/data/services/util";
// import { toast } from "react-hot-toast";

/* ---------- helpers ---------------------------------------------------- */

const PAGE_SIZE = 10;

function buildParams(
  page: number,
  search: string,
  featured?: boolean,
  subscribed?: boolean,
  approved?: boolean
): GetAllBusinessesParams {
  return {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    is_featured: featured,
    is_subscribed: subscribed,
    approved,
    sort_by: "recent",
  };
}

/* ---------- component -------------------------------------------------- */

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [featuredOnly, setFeatured] = useState<boolean>();
  const [subscribedOnly, setPaid] = useState<boolean>();
  const [approvedOnly, setApprovedOnly] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  /* fetch ----------------------------------------------------------------*/
  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params = buildParams(
        page,
        search,
        featuredOnly,
        subscribedOnly,
        approvedOnly
      );

      if (token) {
        const data = await AdminService.getAllBusinesses(token, params);
        setBusinesses(data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, featuredOnly, subscribedOnly, approvedOnly]);

  useEffect(() => {
    fetchBusinesses();
  }, [page, featuredOnly, subscribedOnly, approvedOnly, fetchBusinesses]);
  /* on‑demand search */
  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1); // reset
    fetchBusinesses();
  };

  /* update field ---------------------------------------------------------*/
  const patchField = async (
    id: string,
    key: keyof Pick<
      Business,
      "approved" | "is_featured" | "is_subscribed" | "is_deleted"
    >,
    value: boolean
  ) => {
    // Assuming you have a PATCH route: businesses/:id (body {key,value})
    try {
      const token = await getToken();
      await AdminService.updateBusiness(`${token}`, id, { [key]: value });
      if (key === "is_deleted") {
        setBusinesses((b) => b.filter((x) => x.auth_id !== id));
        alert(`Business deleted successfully!`);
        return;
      }
      setBusinesses((b) =>
        b.map((x) => (x.auth_id === id ? { ...x, [key]: value } : x))
      );
      alert(`Business ${key} updated successfully!`);
    } catch (err) {
      console.error(err);
    }
  };

  /* --------------------------------------------------------------------- */

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-800">Businesses</h1>

      {/* search + filter row */}
      <form onSubmit={onSearch} className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-300 px-3 py-1">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="bg-transparent outline-none w-40"
          />
        </div>

        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={featuredOnly ?? false}
            onChange={(e) => {
              setFeatured(e.target.checked || undefined);
            }}
          />
          Featured Only
        </label>

        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={approvedOnly ?? false}
            onChange={(e) => {
              setApprovedOnly(e.target.checked || undefined);
            }}
          />
          Approved Only
        </label>

        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={subscribedOnly ?? false}
            onChange={(e) => {
              setPaid(e.target.checked || undefined);
            }}
          />
          Subscribed Only
        </label>

        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
        >
          {loading ? "…" : "Apply"}
        </button>
      </form>

      {/* table ------------------------------------------------------------ */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white text-left text-sm">
              <th className="p-2">Approved</th>
              <th className="p-2">Featured</th>
              <th className="p-2">Subscribed</th>
              <th className="p-2">Profile</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {businesses.map((b, i) => (
              <tr
                key={b.auth_id}
                className={i % 2 ? "bg-gray-50" : "bg-gray-100"}
              >
                {/* approved */}
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={b.approved}
                    onChange={(e) =>
                      patchField(b.auth_id, "approved", e.target.checked)
                    }
                  />
                </td>

                {/* featured */}
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={b.is_featured}
                    onChange={(e) =>
                      patchField(b.auth_id, "is_featured", e.target.checked)
                    }
                  />
                </td>

                {/* subscribed */}
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={b.is_subscribed}
                    onChange={(e) =>
                      patchField(b.auth_id, "is_subscribed", e.target.checked)
                    }
                  />
                </td>

                <td className="p-2">
                  <div className="w-10 h-10 relative">
                    <Image
                      src={b.display_image_url || "/avatar.png"}
                      alt={b.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </td>
                <td className="p-2">{b.name || "—"}</td>
                <td className="p-2">{b.contact_email || "—"}</td>
                <td className="p-2">
                  <button
                    className="btn bg-red-500 text-white rounded-md px-2 py-1"
                    onClick={() => patchField(b.auth_id, "is_deleted", true)}
                  >
                    Delete
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* simple pagination ------------------------------------------------ */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          disabled={businesses.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BusinessesPage;
