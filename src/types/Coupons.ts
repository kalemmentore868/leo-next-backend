import { Timestamp } from "firebase/firestore";

export enum CouponTypes {
  SUBSCRIPTION = "subscription",
  SPECIALS = "specials",
  FEATURED = "featured",
  MESSAGE_BLAST = "message_blast",
}

export enum CouponDiscounType {
  PERCENTAGE = "percentage",
  FLAT = "flat",
}

export interface Coupon {
  id: string;
  coupon_type: CouponTypes;
  type: CouponDiscounType;
  name: string;
  is_active: boolean;
  amount: number;
  expires_on: Timestamp;
}
