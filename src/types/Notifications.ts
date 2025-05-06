export type NotificationType = "customer" | "business";

export type Notification = {
  _id: string;
  auth_id: string; // Firebase UID or equivalent
  user_type: NotificationType;
  title: string;
  description: string;
  route?: string; // Optional navigation route for the app
  read: boolean;
  seen: boolean;
  created_at: Date;
  updated_at: Date;
};
