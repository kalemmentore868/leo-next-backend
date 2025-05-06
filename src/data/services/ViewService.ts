// services/ViewService.ts
import { customAuthFetch } from "./util";

export interface ViewPayload {
  business_id: string;
  user_id: string;
}

export class ViewService {
  static async getAllViews(token: string) {
    try {
      const data = await customAuthFetch("views", "GET", token);
      return data;
    } catch (err: any) {
      console.error("Error fetching views:", err.message);
      return null;
    }
  }

  static async createView(token: string, payload: ViewPayload) {
    try {
      const data = await customAuthFetch("views", "POST", token, payload);
      return data;
    } catch (err: any) {
      console.error("Error creating view:", err.message);
      return null;
    }
  }
}
