// src/services/UserService.ts
import { CreateUser, User, UserUpdate } from "../../types/User";
import { customAuthFetch } from "./util";

export interface GetAllUsersParams {
  page?: number; // page number – defaults to 1 on the API
  limit?: number; // page size  – defaults to 10 (or whatever you set server‑side)
  search?: string; // free‑text search against name / email / etc.
}

export interface PaginatedUsers {
  page: number;
  limit: number;
  total: number; // total documents that match the query
  data: User[]; // the actual users for this page
}

export class UserService {
  static async getUserByAuthId(
    auth_id: string,
    token: string
  ): Promise<User | null> {
    try {
      const data = await customAuthFetch(`users/${auth_id}`, "GET", token);
      return data as User;
    } catch (err: any) {
      console.error("Error getting user: ", err.message);
      return null;
    }
  }

  static async updateUser(
    auth_id: string,
    token: string,
    updateUser: UserUpdate
  ): Promise<User | null> {
    try {
      const data = await customAuthFetch(
        `users/${auth_id}`,
        "PUT",
        token,
        updateUser
      );
      return data as User;
    } catch (err: any) {
      console.error("Error updating user: ", err.message);
      return null;
    }
  }

  static async createUser(
    token: string,
    userData: CreateUser
  ): Promise<User | null> {
    try {
      const data = await customAuthFetch("users", "POST", token, userData);
      return data as User;
    } catch (err: any) {
      console.error("Error creating user: ", err.message);
      return null;
    }
  }

  static async getAllUsers(
    token: string,
    params: GetAllUsersParams = {}
  ): Promise<PaginatedUsers | null> {
    try {
      // Build a query‑string from any defined params
      const query = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join("&");

      const endpoint = query ? `users?${query}` : "users";

      const data = await customAuthFetch(endpoint, "GET", token);
      return data as PaginatedUsers;
    } catch (err: any) {
      console.error("Error fetching users: ", err.message);
      return null;
    }
  }
}
