// src/services/PayoutService.ts
import { customAuthFetch } from "./util";
import { ReferralProfile } from "@/src/types/ReferralProfile";

/**
 * A single row from /api/payouts/balances, including the joined referral profile.
 */
export interface WalletBalance {
  auth_id: string;
  current_balance: number;
  lifetime_earnings: number;
  last_payout_at: string | null;
  referral_profile: ReferralProfile | null;
}

export interface PaginatedBalances {
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: WalletBalance[];
}

export class PayoutService {
  /**
   * Fetch outstanding balances (only those > 0), plus referral_profile.
   */
  static async getPending(
    token: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedBalances | null> {
    try {
      const resp = await customAuthFetch(
        `payouts/balances?page=${page}&limit=${limit}`,
        "GET",
        token
      );
      return resp as PaginatedBalances;
    } catch (err) {
      console.error("Error fetching pending payouts:", err);
      return null;
    }
  }

  /**
   * Execute a payout for the given items.
   */
  static async execute(
    token: string,
    items: { auth_id: string; amount: number; related_id: string }[]
  ): Promise<boolean> {
    try {
      const resp = await customAuthFetch("payouts", "POST", token, { items });
      return resp.status === "ok";
    } catch (err) {
      console.error("Error executing payouts:", err);
      return false;
    }
  }
}
