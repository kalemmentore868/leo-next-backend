import {
  Business,
  CreateBusiness,
  FetchedBusiness,
  FetchedSpecial,
} from "../../types/Business";
import { customAuthFetch } from "./util";

interface FetchOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, string | number | boolean>;
}

export class BusinessService {
  static async getAllBusinesses(
    token: string,
    options?: FetchOptions
  ): Promise<Business[] | null> {
    try {
      const queryParams: string[] = [];

      if (options?.page) queryParams.push(`page=${options.page}`);
      if (options?.limit) queryParams.push(`limit=${options.limit}`);

      if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          queryParams.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          );
        }
      }

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

      const data = await customAuthFetch(
        `businesses${queryString}`,
        "GET",
        token
      );

      return data as Business[];
    } catch (err: any) {
      console.error("Error fetching businesses:", err.message);
      return null;
    }
  }

  static async getSpecialOffers(
    token: string,
    filters?: {
      category_id?: string;
      subcategory_id?: string;
      area?: string;
    }
  ): Promise<FetchedSpecial[] | null> {
    try {
      const queryParams: string[] = [];

      queryParams.push("limit=10"); // Fixed limit

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value && value.toLowerCase() !== "any" && value.trim() !== "") {
            queryParams.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            );
          }
        }
      }

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
      console.log(queryString);
      const data = await customAuthFetch(
        `businesses/specials${queryString}`,
        "GET",
        token
      );

      return data as FetchedSpecial[];
    } catch (err: any) {
      console.error("Error fetching specials:", err.message);
      return null;
    }
  }

  static async searchBusinesses(
    token: string,
    searchTerm: string
  ): Promise<Business[] | null> {
    try {
      if (!searchTerm.trim()) return [];

      const data = await customAuthFetch("businesses/search", "POST", token, {
        query: searchTerm,
      });

      return data as Business[];
    } catch (err: any) {
      console.error("Error performing semantic search:", err.message);
      return null;
    }
  }

  static async getBusinessByAuthId(
    token: string,
    auth_id: string
  ): Promise<FetchedBusiness | null> {
    try {
      const data = await customAuthFetch(`businesses/${auth_id}`, "GET", token);
      return data as FetchedBusiness;
    } catch (err: any) {
      console.error(
        `Error fetching business with auth_id ${auth_id}: `,
        err.message
      );
      return null;
    }
  }

  static async createBusiness(
    token: string,
    businessData: CreateBusiness
  ): Promise<Business | null> {
    try {
      const data = await customAuthFetch(
        "businesses",
        "POST",
        token,
        businessData
      );
      return data as Business;
    } catch (err: any) {
      console.error("Error creating business: ", err.message);
      return null;
    }
  }

  static async updateBusiness(
    token: string,
    business_id: string,
    updateData: Partial<Business>
  ): Promise<Business | null> {
    try {
      const data = await customAuthFetch(
        `businesses/${business_id}`,
        "PUT",
        token,
        updateData
      );
      return data as Business;
    } catch (err: any) {
      console.error("Error updating business:", err.message);
      return null;
    }
  }
}
