"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BookingsService } from "@/src/data/services/BookingsServices";
import { getToken } from "@/src/data/services/util";
import { BookingService } from "@/src/types/Bookings";

const PAGE_SIZE = 10;

/* ---------- helper to build query params -------------------- */
interface GetAllParams {
  page: number;
  limit: number;
  search?: string;
  active?: boolean;
  filters?: { name?: string; is_active?: boolean };
}

const makeParams = (
  page: number,
  search: string,
  active?: boolean
): GetAllParams => ({
  page,
  limit: PAGE_SIZE,
  filters: {
    name: search || undefined,
    is_active: active,
  },
});

/* ---------- component --------------------------------------- */
const BookingServicesPage = () => {
  const [services, setServices] = useState<BookingService[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeOnly, setActiveOnly] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  /* fetch ----------------------------------------------------- */
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const params = makeParams(page, search, activeOnly);
      const data = await BookingsService.listServices(token, params);
      setServices(data ?? []);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeOnly]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /* search on demand ----------------------------------------- */
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchServices();
  };

  /* patch is_active ------------------------------------------ */
  const patchActive = async (id: string, value: boolean) => {
    try {
      const token = await getToken();
      await BookingsService.updateService(token!, id, { is_active: value });
      setServices((s) =>
        s.map((svc) => (svc._id === id ? { ...svc, is_active: value } : svc))
      );
      alert("Service visibility updated");
    } catch (err) {
      console.error(err);
    }
  };

  /* ----------------------------- UI ------------------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-800">Booking Services</h1>

      {/* search / filter */}
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-300 px-3 py-1">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name"
            className="bg-transparent outline-none w-44"
          />
        </div>

        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={activeOnly ?? false}
            onChange={(e) => setActiveOnly(e.target.checked || undefined)}
          />
          Active Only
        </label>

        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
        >
          {loading ? "…" : "Apply"}
        </button>
      </form>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white text-left text-sm">
              <th className="p-2">Active</th>
              <th className="p-2">Image</th>
              <th className="p-2">Service</th>
              <th className="p-2">Business Auth&nbsp;ID</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {services.map((svc, i) => (
              <tr
                key={svc._id}
                className={i % 2 ? "bg-gray-50" : "bg-gray-100"}
              >
                {/* active toggle */}
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={svc.is_active}
                    onChange={(e) => patchActive(svc._id, e.target.checked)}
                  />
                </td>

                {/* image */}
                <td className="p-2">
                  <div className="w-10 h-10 relative">
                    <Image
                      src={svc.display_image_url || "/placeholder.png"}
                      alt={svc.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </td>

                <td className="p-2">{svc.name}</td>
                <td className="p-2">{svc.business_auth_id}</td>
                <td className="p-2">
                  {svc.currency} ${(svc.price / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
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
          disabled={services.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingServicesPage;
