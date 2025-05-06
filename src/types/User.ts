export interface UserPreference {
  id: string;
  name: string;
}

export interface UserRole {
  business: boolean;
  customer: boolean;
}

export interface User {
  user_id: string;
  auth_id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  area: string;
  display_picture_url: string;
  pushToken: string;
  last_login: Date;
  created_at: Date;
  role: UserRole;
  is_deleted: boolean;
  preferences: UserPreference[]; // changed from 'preferances'
  active_role?: "business" | "customer"; // optional if you're tracking current context
}

export interface UserUpdate {
  user_id?: string;
  auth_id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  area?: string;
  display_picture_url?: string;
  pushToken?: string;
  last_login?: Date;
  created_at?: Date;
  role?: UserRole;
  is_deleted?: boolean;
  preferences?: UserPreference[]; // changed from 'preferances'
  active_role?: "business" | "customer"; // optional if you're tracking current context
}

export interface CreateUser {
  user_id: string;
  auth_id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  area?: string;
  display_picture_url?: string;
  pushToken: string;
  last_login?: Date;
  created_at?: Date;
  role: UserRole;
  is_deleted: boolean;
  preferences?: UserPreference[]; // changed from 'preferances'
  active_role?: "business" | "customer"; // optional if you're tracking current context
}
