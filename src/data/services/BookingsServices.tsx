// src/data/services/BookingApi.ts
import { Booking, BookingService } from "@/src/types/Bookings";
import { customAuthFetch } from "./util";
import { User } from "@/src/types/User";

interface FetchOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, string | number | boolean>;
}

export interface BookingWindow {
  start: string; // ISO string
  end: string;
}

export interface BookingServiceWithWindows extends BookingService {
  futureBookings: BookingWindow[];
}

export interface BookingWithDetails extends Booking {
  customer: User | null;

  service: BookingService | null;
}

export class BookingsService {
  /* ------------------------------------------------------------ */
  /*  A.  BOOKING-SERVICE (offerings a business creates)          */
  /* ------------------------------------------------------------ */

  // GET /booking-services
  static async listServices(
    token: string,
    options?: FetchOptions
  ): Promise<BookingService[] | null> {
    try {
      const qp: string[] = [];
      if (options?.page) qp.push(`page=${options.page}`);
      if (options?.limit) qp.push(`limit=${options.limit}`);
      if (options?.filters) {
        for (const [k, v] of Object.entries(options.filters)) {
          qp.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
        }
      }
      const url = `booking-services${qp.length ? "?" + qp.join("&") : ""}`;
      return (await customAuthFetch(url, "GET", token)) as BookingService[];
    } catch (err: any) {
      console.error("Error listing booking-services:", err.message);
      return null;
    }
  }

  // POST /booking-services
  static async createService(
    token: string,
    serviceData: Omit<BookingService, "is_active" | "created_at" | "updated_at">
  ): Promise<BookingService | null> {
    try {
      return (await customAuthFetch(
        "booking-services",
        "POST",
        token,
        serviceData
      )) as BookingService;
    } catch (err: any) {
      console.error("Error creating booking-service:", err.message);
      return null;
    }
  }

  static async getServiceById(
    token: string,
    id: string
  ): Promise<BookingServiceWithWindows | null> {
    try {
      return (await customAuthFetch(
        `booking-services/${id}`,
        "GET",
        token
      )) as BookingServiceWithWindows;
    } catch (err: any) {
      console.error("Error creating booking-service:", err.message);
      return null;
    }
  }

  // PUT /booking-services/:id
  static async updateService(
    token: string,
    service_id: string,
    updateData: Partial<BookingService>
  ): Promise<BookingService | null> {
    try {
      return (await customAuthFetch(
        `booking-services/${service_id}`,
        "PUT",
        token,
        updateData
      )) as BookingService;
    } catch (err: any) {
      console.error("Error updating booking-service:", err.message);
      return null;
    }
  }

  /* ------------------------------------------------------------ */
  /*  B.  BOOKINGS  (actual reservations)                         */
  /* ------------------------------------------------------------ */

  // GET /bookings
  static async listBookings(
    token: string,
    options?: FetchOptions
  ): Promise<Booking[] | null> {
    try {
      const qp: string[] = [];
      if (options?.page) qp.push(`page=${options.page}`);
      if (options?.limit) qp.push(`limit=${options.limit}`);
      if (options?.filters) {
        for (const [k, v] of Object.entries(options.filters)) {
          qp.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
        }
      }
      const url = `booking-services/bookings${
        qp.length ? "?" + qp.join("&") : ""
      }`;
      return (await customAuthFetch(url, "GET", token)) as Booking[];
    } catch (err: any) {
      console.error("Error listing bookings:", err.message);
      return null;
    }
  }

  // GET /bookings/by-auth/:auth_id
  static async getBookingsByAuthId(
    token: string,
    auth_id: string
  ): Promise<Booking[] | null> {
    try {
      // you can decide in your API whether auth_id refers to the customer or business;
      // adapt the endpoint path accordingly
      return (await customAuthFetch(
        `booking-services/bookings/by-auth/${auth_id}`,
        "GET",
        token
      )) as Booking[];
    } catch (err: any) {
      console.error("Error fetching bookings by auth_id:", err.message);
      return null;
    }
  }

  // POST /bookings
  static async createBooking(
    token: string,
    bookingData: Omit<Booking, "created_at" | "updated_at" | "_id">
  ): Promise<Booking | null> {
    try {
      return (await customAuthFetch(
        "booking-services/bookings",
        "POST",
        token,
        bookingData
      )) as Booking;
    } catch (err: any) {
      console.error("Error creating booking:", err.message);
      return null;
    }
  }

  // PUT /bookings/:id
  static async updateBooking(
    token: string,
    booking_id: string,
    updateData: Partial<Booking>
  ): Promise<Booking | null> {
    try {
      return (await customAuthFetch(
        `booking-services/bookings/${booking_id}`,
        "PUT",
        token,
        updateData
      )) as Booking;
    } catch (err: any) {
      console.error("Error updating booking:", err.message);
      return null;
    }
  }

  static async getBookingsForBusiness(
    token: string,
    businessAuthId: string
  ): Promise<BookingWithDetails[] | null> {
    try {
      return (await customAuthFetch(
        `booking-services/bookings/business/${businessAuthId}`,
        "GET",
        token
      )) as BookingWithDetails[];
    } catch (err: any) {
      console.error("Error fetching business bookings:", err.message);
      return null;
    }
  }
}
