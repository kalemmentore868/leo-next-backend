export interface AppFeedback {
  id?: string;
  auth_id: string; // Refers to Account.id
  user_type: "user" | "business";
  message: string;
  created_at: Date;
}
