import { User } from "@/src/types/User";
import { Admin } from "../../types/Admin";
import { customAuthFetch } from "./util";
import { Business, Product } from "@/src/types/Business";

export interface AggregatedService extends Omit<Product, "business_auth_id"> {
  // we’ll inject our own below
  /** Firebase/Auth id of the parent business */
  business_auth_id: string;

  /** 0‑based position inside the original business.services array */
  index: number;
}

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
}
