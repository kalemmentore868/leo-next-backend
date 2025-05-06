import { customAuthFetch } from "./util";
import { Share } from "@/src/types/Share";

export class ShareService {
  // Get a specific share by business_id and user_id
  static async getShare(
    token: string,
    business_id: string,
    user_id: string
  ): Promise<Share | null> {
    try {
      const data = await customAuthFetch(
        `shares/${business_id}/${user_id}`,
        "GET",
        token
      );
      return data as Share;
    } catch (err: any) {
      console.error("Error fetching share:", err.message);
      return null;
    }
  }

  // Get all shares
  static async getAllShares(token: string): Promise<Share[] | null> {
    try {
      const data = await customAuthFetch("shares", "GET", token);
      return data as Share[];
    } catch (err: any) {
      console.error("Error fetching all shares:", err.message);
      return null;
    }
  }

  // Create a new share
  static async createShare(
    token: string,
    shareData: {
      business_id: string;
      user_id: string;
      created_at?: Date;
    }
  ): Promise<Share | null> {
    try {
      const data = await customAuthFetch("shares", "POST", token, shareData);
      return data as Share;
    } catch (err: any) {
      console.error("Error creating share:", err.message);
      return null;
    }
  }
}
