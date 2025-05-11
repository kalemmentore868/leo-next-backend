// src/services/ReferralProfileService.ts
import { ReferralProfile } from "@/src/types/ReferralProfile";
import { customAuthFetch } from "./util";

export interface CreateReferralProfilePayload {
  name: string;
  email: string;
  bank: ReferralProfile["bank"];
}

export interface UpdateReferralProfilePayload {
  /** new status: 'pending' | 'approved' | 'rejected' */
  enrollment_status?: ReferralProfile["enrollment_status"];
  enrolled_at?: string | Date | null;
  approved_at?: string | Date | null;
  rejected_at?: string | Date | null;
  notes?: string;
}

export class ReferralProfileService {
  /**
   * Create (enrol) a referral profile — *typically called by the WordPress form,
   * but you can also expose it in the app if needed*.
   */

  static async create(
    token: string,
    data: CreateReferralProfilePayload
  ): Promise<ReferralProfile | null> {
    try {
      const profile = await customAuthFetch(
        "referralProfiles",
        "POST",
        token,
        data
      );

      return profile as ReferralProfile;
    } catch (err: any) {
      console.error("Error creating referral profile:", err.message);
      return null;
    }
  }

  /**
   * Get a single referral profile by Firebase UID (auth_id).
   * Business users can call it with their own UID; admins can fetch any.
   */
  static async getOne(
    token: string,
    auth_id: string
  ): Promise<ReferralProfile | null> {
    try {
      const profile = await customAuthFetch(
        `referralProfiles/${auth_id}`,
        "GET",
        token
      );

      return profile as ReferralProfile;
    } catch (err: any) {
      console.error("Error fetching referral profile:", err.message);
      return null;
    }
  }

  /**
   * Update status/timestamps/notes (admin only).
   */
  static async updateStatus(
    token: string,
    auth_id: string,
    updates: UpdateReferralProfilePayload
  ): Promise<ReferralProfile | null> {
    try {
      const profile = await customAuthFetch(
        `referralProfiles/${auth_id}`,
        "PATCH",
        token,
        updates
      );

      return profile as ReferralProfile;
    } catch (err: any) {
      console.error("Error updating referral profile:", err.message);
      return null;
    }
  }

  /**
   * Paginated list for admin dashboard.
   *
   * @param token   Auth token
   * @param page    1-based page number (default 1)
   * @param limit   page size (default 20)
   * @param status  optional filter ('pending' | 'approved' | 'rejected')
   */
  static async getAll(
    token: string,
    page = 1,
    limit = 20,
    status?: "pending" | "approved" | "rejected"
  ): Promise<{
    page: number;
    limit: number;
    total: number;
    pages: number;
    data: ReferralProfile[];
  } | null> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (status) params.append("status", status);

      const resp = await customAuthFetch(
        `referralProfiles?${params.toString()}`,
        "GET",
        token
      );

      return resp as {
        page: number;
        limit: number;
        total: number;
        pages: number;
        data: ReferralProfile[];
      };
    } catch (err: any) {
      console.error("Error fetching referral profiles:", err.message);
      return null;
    }
  }
}
