export interface WeeklyAvailability {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface BookingService {
  _id: string;
  business_auth_id: string; // ref → Business
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  currency: "TTD" | "USD";
  availability: WeeklyAvailability[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  display_image_url: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export interface Booking {
  _id: string;
  service_id: string; // ref → Service
  business_auth_id: string; // denormalised for easy querying
  customer_auth_id: string; // ref → User
  start: Date;
  end: Date;
  amount: number;
  currency: "TTD" | "USD";
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_id?: string; // ref → Payment
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
