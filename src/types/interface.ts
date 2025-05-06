import { OpeningHour } from "@/components/business/details/OpeningHours.ios";

export enum item_type {
  PRODUCT,
  SERVICE,
}

export enum CollectionNames {
  Services = "Services",
  Products = "Products",
  Prices = "Prices",
  Galleries = "Galleries",
  Businesses = "Businesses",
  Locations = "Locations",
  Users = "Users",
  Messages = "Messages",
  Reviews = "Reviews",
  Categories = "Categories",
  Feedback = "Feedback",
  Likes = "Likes",
  Views = "Views",
  Shares = "Shares",
  Subcategories = "Subcategories",
  Orders = "Orders",
  VisibilitySettings = "VisibilitySettings",
  BusinessExtraDetails = "BusinessExtraDetails",
  Specials = "Specials",
}

export interface UserData {
  id?: string;
  display_picture_url: string;
  first_name: string;
  last_name: string;
  last_login: Date;
  email: string;
  username: string;
  phone: string;
  auth_id: string;
  role: {
    customer: boolean;
    business: boolean;
  };
  pushToken?: string;
  created_at: Date;
  area?: string;
  preferances?: { id: string; name: string }[];
}

export interface serviceInterface {
  name: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  display_image_url: string;
  price_amount: number;
  created_at: Date;
  updated_at: Date;
  business_id: string;
  approved: boolean;
  hide_price?: boolean;
  item_type: "service" | "product";
}

export interface ServiceData {
  id?: string;
  business_id: string;
  name: string;
  description: string;
  approved?: boolean;
  hide_price?: boolean;
  display_image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PriceData {
  id?: string;
  item_id: string;
  item_type: "service" | "product";
  price_amount: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export interface GalleryData {
  id?: string;
  item_id: string;
  item_type: "service" | "product";
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessData {
  id?: string;
  auth_id: string;
  name: string;
  description: string;
  contact_email: string;
  social_media: {
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    tiktok_url: string;
  };
  category_id: string;
  subcategory_id: string;
  display_image_url: string | null;
  approved: boolean;
  auto_approve_listings: boolean;
  is_featured?: boolean;
  pushToken?: string;
  created_at: Date;
  business_registration_doc_link?: string | null;
  phone?: string;
}

export interface LocationData {
  id?: string;
  address_line_1?: string;
  address_line_2?: string | null;
  area: string;
  city?: string;
  state?: string;
  country?: string;
  show_address?: boolean;
  is_online?: boolean;
}

export interface ProductData {
  id?: string;
  business_id: string;
  name: string;
  description: string;
  approved?: boolean;
  hide_price?: boolean;
  display_image_url: string | null;
  created_at: Date;
  updated_at: Date;
  item_type?: "service" | "product";
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  display_image_url: string;
  price_amount: number;
  created_at: Date;
  updated_at: Date;
  business_id: string;
  approved: boolean;
  item_type: "service" | "product";
  hide_price?: boolean;
}

export interface ReviewData {
  id?: string;
  approved: boolean;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  updated_at: Date;
  created_at: Date;
}

export interface ReviewItem {
  id?: string;
  approved: boolean;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  updated_at: Date;
  created_at: Date;
  user_name: string;
  user_image: string;
  business_name?: string;
}

export interface MessageData {
  id?: string;
  business_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: Date;
}

export interface MessageItem {
  id?: string;
  business_id: string;
  business_name: string;
  business_image: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: Date;
  pushToken: string;
}

export interface MessageItem2 {
  id?: string;
  user_id: string;
  user_name: string;
  user_image: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: Date;
}

export interface ChatData {
  id?: string;
  sender_id: string;
  receiver_id: string;
  business_id: string;
  content: string;
  created_at: Date;
}

export interface FeedbackData {
  id?: string;
  user_id: string;
  content: string;
  created_at: Date;
}

export interface CategoryInt {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  iconName?: string;
}

export interface SubCategoryInt {
  id: string;
  name: string;
  category_id: string;
  iconName?: string;
  image_url: string;
}

export interface SubCategoryInt {
  id: string;
  name: string;
  category_id: string;
  iconName?: string;
  image_url: string;
}

export interface LikeData {
  id?: string;
  user_id: string;
  business_id: string;
  created_at: Date;
}

export interface ViewData {
  id?: string;
  business_id: string;
  count: number;
  created_at: Date;
}

export interface ShareData {
  id?: string;
  business_id: string;
  count: number;
  created_at: Date;
}

// export interface SpecialOffer {
//   id?: string;
//   business_id: string;
//   title: string;
//   description: string;
//   image_url: string;
//   created_at: Date;
//   updated_at: Date;
//   prices: {
//     currency: string;
//     price_amount: number;
//     price_unit?: string;
//   }[];
//   type: "product" | "service";
// }

// Interface for business details
export interface BusinessWithDetails {
  id?: string;
  name: string;
  display_image_url: string;
  location: string;
  business_images: string[];
  review_count: number;
  average_rating: number;
  category_id: string;
  category_name: string;
  category_icon: string;
  approved?: boolean;
  is_leo_certified?: boolean;
  show_reviews?: boolean;
}

export interface SpecialOffer {
  id: string;
  business_id: string;
  name: string;
  display_image_url: string;
  prices: PriceData[];
  type: "product" | "service";
}

export interface Order {
  id?: string; // Document ID (optional, as it's typically added when fetched from Firestore)
  type: "subscription" | "featured" | "special" | "message-blast"; // Type of the order
  type_id: string; // ID of the associated entity (e.g., business ID or product ID)
  status: "pending" | "active" | "expired" | "cancelled" | "failed"; // Current status of the order
  subscription_type?: "monthly" | "yearly"; // Type of subscription, if applicable
  total: number; // Total amount for the order
  date_created: Date; // Timestamp when the order was created
  expiry_date?: Date; // Expiry date for subscriptions, if applicable
  start_date?: Date;
  was_discount_applied?: boolean;
  coupon_id?: string;
}

export interface Policy {
  payment: string;
  cancellation: string;
}

export interface BusinessExtraDetails {
  id?: string;
  business_id?: string;
  opening_hours: OpeningHour[];
  amenities: string[];
  policy: Policy;
}

export interface VisibilitySettings {
  id?: string;
  business_id: string;
  show_opening_hours: boolean;
  show_amenities: boolean;
  show_products: boolean;
  show_services: boolean;
  show_location: boolean;
  show_phone_number: boolean;
  show_email: boolean;
  show_payment_policy: boolean;
  show_cancellation_policy: boolean;
  show_social_media: boolean;
  show_reviews: boolean;
}

export interface SpecialOfferFirebase {
  id: string;
  business_id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  type: "product" | "service";
  status: "active" | "expired" | "pending";
  category_id: string;
  subcategory_id: string;
}
