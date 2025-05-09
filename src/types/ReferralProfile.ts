export type EnrollmentStatus = "pending" | "approved" | "rejected";

export interface BankDetails {
  account_name: string;
  account_number: string;
  transit_number?: string;
  bank_name: string;
  branch: string;
  account_type: "checking" | "savings";
  type: "personal" | "business";
}

export interface ReferralProfile {
  _id?: string;
  auth_id: string;
  legal_name: string;
  contact_email: string;
  bank: BankDetails;
  enrollment_status: EnrollmentStatus;
  referral_code?: string | null;
  enrolled_at: Date;
  approved_at?: Date | null;
  rejected_at?: Date | null;
  notes?: string;
}
