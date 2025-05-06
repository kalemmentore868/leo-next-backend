import { User } from "@/src/types/User";
import { Admin } from "../../types/Admin";
import { customAuthFetch } from "./util";
import { Business } from "@/src/types/Business";

export interface AdminPageStats {
  totalUsers: number;
  totalBusinesses: number;
  totalProducts: number;
  totalServices: number;
  totalSpecials: number;
  allUsers: User[];
  allBusinesses: Business[];
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
}
