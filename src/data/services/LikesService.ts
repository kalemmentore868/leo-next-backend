import { Business } from "@/types/Business";
import { customAuthFetch } from "./util";
import { Like } from "@/types/Likes"; // Assuming you have this type

export class LikeService {
  static async getLike(
    token: string,
    business_id: string,
    user_id: string
  ): Promise<Like | null> {
    try {
      const data = await customAuthFetch(
        `likes/${business_id}/${user_id}`,
        "GET",
        token
      );
      return data as Like;
    } catch (err: any) {
      console.error("Error fetching like:", err.message);
      return null;
    }
  }

  static async createLike(
    token: string,
    likeData: {
      business_id: string;
      user_id: string;
      created_at?: Date;
    }
  ): Promise<Like | null> {
    try {
      const data = await customAuthFetch("likes", "POST", token, likeData);
      return data as Like;
    } catch (err: any) {
      console.error("Error creating like:", err.message);
      return null;
    }
  }

  static async deleteLike(
    token: string,
    business_id: string,
    user_id: string
  ): Promise<boolean> {
    try {
      await customAuthFetch(`likes/${business_id}/${user_id}`, "DELETE", token);
      return true;
    } catch (err: any) {
      console.error("Error deleting like:", err.message);
      return false;
    }
  }

  static async getLikedBusinesses(
    token: string,
    user_id: string
  ): Promise<Business[] | null> {
    try {
      const data = await customAuthFetch(
        `likes/user/${user_id}/businesses`,
        "GET",
        token
      );
      return data as Business[];
    } catch (err: any) {
      console.error("Error fetching liked businesses:", err.message);
      return [];
    }
  }
}
