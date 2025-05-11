// src/services/ReferralInviteService.ts
import { ReferralInvite } from "@/src/types/ReferralInvites";
import { customAuthFetch } from "./util";
import { ReferralProfile } from "@/src/types/ReferralProfile";

/**
 * Payload for creating a referral invite
 */
export interface CreateReferralInvitePayload {
  referrer_id: string;
  invitee_email: string;
}

export interface ClaimInviteResult {
  status: "ok" | string;
  message: string;
  referrerProfile: ReferralProfile;
}

export class ReferralInviteService {
  /**
   * Create (send) a new referral invite
   * @param token - Auth token (Bearer)
   * @param data - Invite payload: referrer_id and invitee_email
   * @returns The created ReferralInvite or null on failure
   */
  static async create(
    token: string,
    data: CreateReferralInvitePayload
  ): Promise<ReferralInvite | null> {
    try {
      const invite = await customAuthFetch(
        `referralInvites`,
        "POST",
        token,
        data
      );
      return invite as ReferralInvite;
    } catch (err: any) {
      console.error("Error creating referral invite:", err.message);
      return null;
    }
  }

  static async claimInvite(
    token: string,
    inviteCode: string,
    auth_id: string
  ): Promise<ClaimInviteResult | null> {
    try {
      const result = await customAuthFetch(
        "referralInvites/claim",
        "POST",
        token,
        {
          invite_code: inviteCode,
          auth_id,
        }
      );
      return result as ClaimInviteResult;
    } catch (err: any) {
      console.error("Error claiming referral invite:", err.message);
      return null;
    }
  }

  static async getAll(
    token: string,
    page = 1,
    limit = 20,
    referrer_id?: string,
    status?: string
  ): Promise<{
    page: number;
    limit: number;
    total: number;
    pages: number;
    data: ReferralInvite[];
  } | null> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (referrer_id) params.append("referrer_id", referrer_id);
      if (status) params.append("status", status);

      const resp = await customAuthFetch(
        `referralInvites?${params.toString()}`,
        "GET",
        token
      );
      return resp as {
        page: number;
        limit: number;
        total: number;
        pages: number;
        data: ReferralInvite[];
      };
    } catch (err: any) {
      console.error("Error fetching referral invites:", err.message);
      return null;
    }
  }
}
