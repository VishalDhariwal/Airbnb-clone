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
