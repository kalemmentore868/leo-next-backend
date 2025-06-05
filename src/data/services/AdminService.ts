import { User } from "@/src/types/User";
import { Admin } from "../../types/Admin";
import { customAuthFetch } from "./util";
import { Business, Product, Special } from "@/src/types/Business";

export interface AggregatedService extends Omit<Product, "business_auth_id"> {
  business_auth_id: string;

  index: number;
}

export interface AggregatedSpecial extends Omit<Special, "business_auth_id"> {
  business_auth_id: string;
  index: number;
}

export interface SpecialsResponse {
  total: number;
  page: number;
  limit: number;
  data: AggregatedSpecial[];
}

export type GetAllSpecialsParams = {
  page?: number;
  limit?: number;
  search?: string; // by title
};

export interface AdminPageStats {
  totalUsers: number;
  totalBusinesses: number;
  totalProducts: number;
  totalServices: number;
  totalSpecials: number;
  allUsers: User[];
  allBusinesses: Business[];
}

export type GetAllServicesParams = {
  /** 1‑based page number – default 1 */
  page?: number;
  /** items per page – default 10 */
  limit?: number;
  /** case‑insensitive filter on service.name */
  search?: string;

  type?: "service" | "product"; // filter by type
};

/** Shape of the response that backend returns */
export interface ServicesResponse {
  total: number; // total matches in DB
  page: number; // current page
  limit: number; // page size
  data: AggregatedService[]; // paginated list
}

export type GetAllBusinessesParams = {
  page?: number;
  limit?: number;
  area?: string;
  category_id?: string;
  subcategory_id?: string;
  is_featured?: boolean;
  is_subscribed?: boolean;
  approved?: boolean;
  sort_by?: "recent" | "views" | "name";
  search?: string;
};

export interface GetAllReviewsParams {
  page?: number;
  limit?: number;
  search?: string; // free-text on comment
}

export interface AuthUserRow {
  uid: string;
  email?: string;
  createdAt: string; // ISO string
  lastLogin?: string; // ISO string | undefined
}

export interface ReviewsResponse {
  total: number;
  page: number;
  limit: number;
  data: AggregatedReview[];
}

export interface AggregatedReview {
  _id: string; // Mongo id of review document
  business_id: string;
  user_id: string;
  comment: string;
  rating: number;
  approved: boolean;
  created_at: string;
  business_name: string;
  user_name: string;
}

export class AdminService {
  static async getAdminByAuthId(
    token: string,
    auth_id: string
  ): Promise<Admin | null> {
    try {
      const data = await customAuthFetch(`admins/${auth_id}`, "GET", token);
      return data as Admin;
    } catch (err: any) {
      console.error(
        `Error fetching admin with auth_id ${auth_id}:`,
        err.message
      );
      return null;
    }
  }

  static async getAuthenticatedAdmin(token: string): Promise<Admin | null> {
    try {
      const data = await customAuthFetch("admins/auth", "GET", token);
      return data as Admin;
    } catch (err: any) {
      console.error("Error fetching authenticated admin:", err.message);
      return null;
    }
  }

  static async getAdminPageStats(
    token: string
  ): Promise<AdminPageStats | null> {
    try {
      const data = await customAuthFetch("admins/stats", "GET", token);
      return data;
    } catch (err: any) {
      console.error("Error fetching admin page stats:", err.message);
      return null;
    }
  }

  static async getAllBusinesses(
    token: string,
    params?: GetAllBusinessesParams
  ): Promise<Business[] | null> {
    try {
      let query = "";
      if (params) {
        const queryParts: string[] = [];
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            queryParts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            );
          }
        }
        if (queryParts.length > 0) {
          query = `?${queryParts.join("&")}`;
        }
      }

      const data = await customAuthFetch(
        `admins/businesses${query}`,
        "GET",
        token
      );
      return data as Business[];
    } catch (err: any) {
      console.error("Error fetching businesses:", err.message);
      return null;
    }
  }

  static async updateBusiness(
    token: string,
    auth_id: string,
    body: any
  ): Promise<Business[] | null> {
    try {
      const data = await customAuthFetch(
        `admins/businesses/${auth_id}`,
        "PUT",
        token,
        body
      );
      return data as Business[];
    } catch (err: any) {
      console.error("Error fetching businesses:", err.message);
      return null;
    }
  }

  static async getAllServices(
    token: string,
    params: GetAllServicesParams = {}
  ): Promise<ServicesResponse | null> {
    try {
      /* build query‑string only from defined keys */
      const query = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join("&");

      const endpoint = query ? `admins/services?${query}` : "admins/services";
      const data = await customAuthFetch(endpoint, "GET", token);
      return data as ServicesResponse;
    } catch (err: any) {
      console.error("Error fetching services:", err.message);
      return null;
    }
  }

  // src/data/services/AdminService.ts
  static async updateService(
    token: string,
    index: number,
    business_auth_id: string,
    approved: boolean,
    type: "service" | "product" = "service"
  ): Promise<Product | null> {
    try {
      const data = await customAuthFetch(
        `admins/services/${business_auth_id}/${index}/approve?type=${type}`,
        "PATCH",
        token,
        { approved } // 👈 body
      );
      return data as Product;
    } catch (err: any) {
      console.error("Error updating service:", err.message);
      return null;
    }
  }

  static async getAllSpecials(
    token: string,
    params: GetAllSpecialsParams = {}
  ): Promise<SpecialsResponse | null> {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
      )
      .join("&");

    const endpoint = query ? `admins/specials?${query}` : `admins/specials`;

    try {
      const data = await customAuthFetch(endpoint, "GET", token);
      return data as SpecialsResponse;
    } catch (err: any) {
      console.error("Error fetching specials:", err.message);
      return null;
    }
  }

  /** Toggle / set `approved` on a single special */
  static async updateSpecial(
    token: string,
    index: number,
    business_auth_id: string,
    status: "active" | "expired" | "pending"
  ): Promise<AggregatedSpecial | null> {
    try {
      const data = await customAuthFetch(
        `admins/specials/${business_auth_id}/${index}`,
        "PATCH",
        token,
        { status }
      );
      return data as AggregatedSpecial;
    } catch (err: any) {
      console.error("Error updating special:", err.message);
      return null;
    }
  }

  static async getAllReviews(
    token: string,
    params: GetAllReviewsParams = {}
  ): Promise<ReviewsResponse | null> {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
      )
      .join("&");

    const endpoint = query ? `admins/reviews?${query}` : "admins/reviews";

    try {
      return (await customAuthFetch(endpoint, "GET", token)) as ReviewsResponse;
    } catch (err: any) {
      console.error("Error fetching reviews:", err.message);
      return null;
    }
  }

  static async updateReview(
    token: string,
    reviewId: string,
    approved: boolean
  ): Promise<AggregatedReview | null> {
    try {
      return (await customAuthFetch(
        `admins/reviews/${reviewId}`,
        "PATCH",
        token,
        { approved }
      )) as AggregatedReview;
    } catch (err: any) {
      console.error("Error updating review:", err.message);
      return null;
    }
  }

  static async getAllAuthUsers(
    token: string,
    pageToken?: string,
    limit = 50
  ): Promise<{ users: AuthUserRow[]; nextPageToken?: string } | null> {
    try {
      const q = new URLSearchParams();
      if (pageToken) q.set("pageToken", pageToken);
      if (limit) q.set("limit", String(limit));

      const endpoint =
        q.toString().length > 0
          ? `admins/auth-users?${q}`
          : "admins/auth-users";

      return (await customAuthFetch(endpoint, "GET", token)) as {
        users: AuthUserRow[];
        nextPageToken?: string;
      };
    } catch (err: any) {
      console.error("Error fetching auth users:", err.message);
      return null;
    }
  }
}
