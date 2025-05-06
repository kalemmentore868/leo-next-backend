import { customAuthFetch } from "./util";
import { ReviewItem } from "@/types/interface";

export class ReviewService {
  static async getReviewsByBusinessId(
    token: string,
    business_id: string
  ): Promise<ReviewItem[] | null> {
    try {
      const data = await customAuthFetch(
        `reviews/${business_id}`,
        "GET",
        token
      );
      return data as ReviewItem[];
    } catch (err: any) {
      console.error("Error fetching reviews:", err.message);
      return null;
    }
  }

  static async createReview(
    token: string,
    reviewData: {
      business_id: string;
      user_id: string;
      comment: string;
      rating: number;
      approved?: boolean;
    }
  ): Promise<ReviewItem | null> {
    try {
      const data = await customAuthFetch("reviews", "POST", token, reviewData);
      return data as ReviewItem;
    } catch (err: any) {
      console.error("Error creating review:", err.message);
      return null;
    }
  }

  static async getReviewsByUserId(
    token: string,
    user_id: string
  ): Promise<ReviewItem[] | null> {
    try {
      const data = await customAuthFetch(
        `reviews/user/${user_id}`,
        "GET",
        token
      );
      return data as ReviewItem[];
    } catch (err: any) {
      console.error("Error fetching user reviews:", err.message);
      return null;
    }
  }
}
