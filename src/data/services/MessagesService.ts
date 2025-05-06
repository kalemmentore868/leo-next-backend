import { customAuthFetch } from "./util"; // assuming you have this
import { Message } from "@/src/types/Messages"; // assuming you have this

export class MessagesService {
  // Send/create a new message
  static async createMessage(
    token: string,
    {
      senderId,
      receiverId,
      senderType,
      receiverType,
      content,
    }: {
      senderId: string;
      receiverId: string;
      senderType: "customer" | "business";
      receiverType: "customer" | "business";
      content: string;
    }
  ): Promise<Message | null> {
    try {
      const message = await customAuthFetch("messages", "POST", token, {
        senderId,
        receiverId,
        senderType,
        receiverType,
        content,
      });

      return message;
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      return null;
    }
  }

  // Fetch messages between two users (with optional polling support)
  static async getMessages(
    token: string,
    {
      senderId,
      receiverId,
      since,
    }: {
      senderId: string;
      receiverId: string;
      since?: string; // optional for polling
    }
  ): Promise<Message[]> {
    try {
      let url = `messages?senderId=${senderId}&receiverId=${receiverId}`;

      if (since) {
        url += `&since=${since}`;
      }

      const messages = await customAuthFetch(url, "GET", token);

      return messages || [];
    } catch (error: any) {
      console.error("Error fetching messages:", error.message);
      return [];
    }
  }

  // NEW: Fetch latest conversations for a user (business or customer)
  static async getLatestMessages(
    token: string,
    {
      auth_id,
      user_type,
    }: {
      auth_id: string;
      user_type: "customer" | "business";
    }
  ): Promise<any[]> {
    try {
      const url = `messages/latest?auth_id=${auth_id}&user_type=${user_type}`;
      const latestMessages = await customAuthFetch(url, "GET", token);

      return latestMessages || [];
    } catch (error: any) {
      console.error("Error fetching latest messages:", error.message);
      return [];
    }
  }
}
