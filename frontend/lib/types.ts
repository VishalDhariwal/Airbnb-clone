/**
 * Shared TypeScript type definitions for Airbnb Clone.
 * Mirrors FastAPI Pydantic schemas (§0.2 Rule 5).
 */

export interface HealthResponse {
  status: string;
  app: string;
  api_version?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  is_host: boolean;
  is_superhost: boolean;
  bio?: string | null;
  response_rate?: number | null;
  joined_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  is_host: boolean;
  is_superhost: boolean;
  role_badge: "Superhost" | "Host" | "Guest";
}

export interface ListingPhoto {
  id: number;
  url: string;
  caption?: string | null;
  position: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon_key: string;
  category: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_key: string;
}

export interface HostSummary {
  id: number;
  name: string;
  avatar_url?: string | null;
  is_superhost: boolean;
  bio?: string | null;
  response_rate?: number | null;
  joined_year?: number | null;
}

export interface ListingCard {
  id: number;
  title: string;
  property_type: string;
  room_type: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  total_price: number;
  nights: number;
  avg_rating: number;
  review_count: number;
  is_guest_favorite: boolean;
  photos: ListingPhoto[];
}

export interface ListingDetail extends ListingCard {
  description: string;
  cleaning_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  host: HostSummary;
  categories: Category[];
  amenities: Amenity[];
  amenities_grouped: Record<string, Amenity[]>;
}

export interface QuoteRequest {
  check_in: string;
  check_out: string;
  guests: number;
}

export interface QuoteResponse {
  listing_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  nightly_rate: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  taxes: number;
  total_price: number;
  available: boolean;
}

export interface Review {
  id: number;
  listing_id: number;
  author: {
    id: number;
    name: string;
    avatar_url?: string | null;
  };
  rating: number;
  cleanliness: number;
  accuracy: number;
  check_in_rating: number;
  communication: number;
  location_rating: number;
  value_rating: number;
  comment: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface BookingCreateRequest {
  listing_id: number;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  adults: number;
  children?: number;
  infants?: number;
  pets?: number;
}

export interface ListingSummaryForBooking {
  id: number;
  title: string;
  property_type: string;
  room_type: string;
  city: string;
  state: string;
  country: string;
  cover_photo?: string | null;
  avg_rating: number;
  review_count: number;
}

export interface BookingConfirmation {
  id: number;
  confirmation_code: string;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  nights: number;
  nightly_rate: number;
  cleaning_fee: number;
  service_fee: number;
  taxes: number;
  total_price: number;
  status: string;
  created_at: string;
  listing?: ListingSummaryForBooking | null;
}

export interface TripsResponse {
  upcoming: BookingConfirmation[];
  past: BookingConfirmation[];
}

export interface BookingCancelResponse {
  id: number;
  status: string;
  confirmation_code: string;
  message: string;
}
