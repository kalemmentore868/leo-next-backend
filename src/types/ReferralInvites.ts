export type ReferralInviteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "expired"
  | "rewarded"
  | "cancelled";

export interface ReferralInviteMetadata {
  ip?: string;
}

export interface ReferralInvite {
  _id?: string;

  referrer_id: string;

  invitee_email: string;

  invitee_auth_id: string | null;

  invite_code: string;

  status: ReferralInviteStatus;

  sent_at: Date;

  accepted_at?: Date | null;

  expires_at: Date;

  rewarded_at: Date | null;

  metadata?: ReferralInviteMetadata;
}
