export interface Message {
  _id: string;
  senderId: string; // user ID or business ID
  receiverId: string; // user ID or business ID
  senderType: "customer" | "business";
  receiverType: "customer" | "business";
  content: string;
  timestamp: string; // ISO date string
  seen: boolean;
}
