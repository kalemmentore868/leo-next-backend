import { Category, Subcategory } from "./Category";

type Opening_Hour = {
  closeTime: string | null;
  openTime: string | null;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  isClosed: boolean;
};

export type BusinessDisplaySettings = {
  business_id?: string;
  show_amenities: boolean;
  show_cancellation_policy: boolean;
  show_email: boolean;
  show_location: boolean;
  show_opening_hours: boolean;
  show_payment_policy: boolean;
  show_phone_number: boolean;
  show_products: boolean;
  show_reviews: boolean;
  show_services: boolean;
  show_social_media: boolean;
};

export type BusinessLocation = {
  address_line_1: string;
  address_line_2: string;
  area: string;
  city: string;
  country: string;
  is_online: boolean;
  state: string;
};

type Social_Media = {
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
};

export type BusinessExtraDetails = {
  amenities: string[];
  opening_hours: Opening_Hour[];
  policy: {
    cancellation: string;
    payment: string;
  };
};

export type Product = {
  approved: boolean;
  created_at: Date; // or Date if you're parsing to Date objects
  description: string;
  display_image_url: string;
  hide_price: boolean;
  name: string;
  price: number;
  updated_at: Date; // or Date if you're parsing to Date objects
};

export type Special = {
  category_id: string;
  created_at: string; // or Date
  description: string;
  image_url: string;
  status: "active" | "expired" | "pending";
  subcategory_id: string;
  title: string;
  type: "product" | "service";
  updated_at: string; // or Date
};

export type FetchedSpecial = {
  special: Special;
  auth_id: string;
  business_id: string;
  business_name: string;
  business_image: string;
};

export type Review = {
  approved: boolean;
  comment: string;
  created_at: string; // or Date
  rating: number;
  updated_at: string; // or Date
  user_id: string;
};

export type Business = {
  approved: boolean;
  business_id: string;
  auth_id: string;
  name: string;
  category_id: string;
  subcategory_id: string;
  description: string;
  display_image_url: string;
  is_featured: boolean;
  has_paid: boolean;
  contact_email: string;
  business_registration_doc_link: string;
  phone: string;
  views_count: number;
  share_count: number;
  reviews_count: number;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
  push_token: string;
  is_subscribed: boolean;
  business_summary: string;
  social_media: Social_Media;
  business_extra_details: BusinessExtraDetails;
  location: BusinessLocation;
  visibility_settings: BusinessDisplaySettings;
  products: Product[];
  services: Product[];
  specials: Special[];
  is_deleted: Boolean;
};

export type FetchedBusiness = Omit<
  Business,
  "category_id" | "subcategory_id"
> & {
  category: Category;
  subcategory: Subcategory;
};

export type UpdateBusiness = {
  auth_id?: string;
  approved: boolean;
  name?: string;
  category_id?: string;
  subcategory_id?: string;
  description?: string;
  display_image_url?: string | null;
  is_featured?: boolean;
  has_paid?: boolean;
  contact_email?: string;
  business_registration_doc_link?: string | null;
  phone?: string;
  view_count?: number;
  share_count?: number;
  reviews_count?: number;
  likes_count?: number;
  created_at?: Date;
  updated_at?: Date;
  push_token?: string;
  is_subscribed?: boolean;
  business_summary?: string;
  social_media?: Social_Media;
  business_extra_details?: BusinessExtraDetails;
  location?: BusinessLocation;
  visibility_settings?: BusinessDisplaySettings;
  products?: Product[];
  services?: Product[];
  specials?: Special[];
  is_deleted?: Boolean;
};

export type CreateBusiness = {
  approved: boolean;
  business_id: string;
  auth_id: string;
  is_deleted: Boolean;
  created_at?: Date;
  updated_at?: Date;
  push_token: string;
  name?: string;
  contact_email?: string;
  display_image_url?: string;
};
