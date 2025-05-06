// src/services/UserService.ts
import { CreateUser, User, UserUpdate } from "../../types/User";
import { customAuthFetch } from "./util";

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
}
