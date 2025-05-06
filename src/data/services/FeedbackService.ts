import { AppFeedback } from "@/types/Feedback";
import { customAuthFetch } from "./util";

export class FeedbackService {
  /**
   * Create a new feedback entry.
   *
   * @param token - Auth token for authenticated request
   * @param feedbackData - The feedback data to be sent
   * @returns Promise<AppFeedback | null>
   */
  static async createFeedback(
    token: string,
    feedbackData: Omit<AppFeedback, "id" | "createdAt">
  ): Promise<AppFeedback | null> {
    try {
      const feedback = await customAuthFetch(
        "feedback",
        "POST",
        token,
        feedbackData
      );

      return feedback;
    } catch (err: any) {
      console.error("Error creating feedback:", err.message);
      return null;
    }
  }
}
