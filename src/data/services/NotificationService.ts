import { Notification } from "@/src/types/Notifications";
import { customAuthFetch } from "./util";

export class NotificationService {
  /**
   * Create a new notification.
   *
   * @param token - Auth token for authenticated request
   * @param notificationData - The notification data to be sent
   * @returns Promise<Notification | null>
   */
  static async createNotification(
    token: string,
    notificationData: Omit<Notification, "created_at" | "updated_at">
  ): Promise<Notification | null> {
    try {
      const notification = await customAuthFetch(
        "notifications",
        "POST",
        token,
        notificationData
      );
      return notification;
    } catch (err: any) {
      console.error("Error creating notification:", err.message);
      return null;
    }
  }

  /**
   * Fetch all notifications for a specific user.
   *
   * @param token - Auth token
   * @param auth_id - The user's auth ID
   * @returns Promise<Notification[]>
   */
  static async getNotifications(
    token: string,
    auth_id: string,
    type: "customer" | "business",
    page: number = 1,
    limit: number = 10
  ): Promise<Notification[]> {
    try {
      const notifications = await customAuthFetch(
        `notifications/${auth_id}?type=${type}&page=${page}&limit=${limit}`,
        "GET",
        token
      );
      return notifications;
    } catch (err: any) {
      console.error("Error fetching notifications:", err.message);
      return [];
    }
  }

  /**
   * Mark a specific notification as read.
   *
   * @param token - Auth token
   * @param notificationId - ID of the notification to mark as read
   * @returns Promise<Notification | null>
   */
  static async markAsRead(
    token: string,
    notificationId: string
  ): Promise<Notification | null> {
    try {
      const updatedNotification = await customAuthFetch(
        `notifications/read/${notificationId}`,
        "PATCH",
        token
      );
      return updatedNotification;
    } catch (err: any) {
      console.error("Error marking notification as read:", err.message);
      return null;
    }
  }

  /**
   * Mark all notifications as seen for a user.
   *
   * @param token - Auth token
   * @param auth_id - The user's auth ID
   * @returns Promise<boolean>
   */
  static async markAllAsSeen(token: string, auth_id: string): Promise<boolean> {
    try {
      await customAuthFetch(`notifications/seen/${auth_id}`, "PATCH", token);
      return true;
    } catch (err: any) {
      console.error("Error marking notifications as seen:", err.message);
      return false;
    }
  }
}
