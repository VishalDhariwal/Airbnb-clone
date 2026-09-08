export interface HostListing {
  id: number;
  title: string;
  property_type: string;
  room_type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  price_per_night: number;
  cleaning_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  is_active: boolean;
  cover_photo?: string | null;
  avg_rating: number;
  review_count: number;
  total_reservations: number;
  total_earnings: number;
  created_at: string;
}

export interface HostReservation {
  id: number;
  confirmation_code: string;
  listing_id: number;
  listing_title: string;
  listing_city: string;
  guest: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
  };
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  nights: number;
  total_price: number;
  status: string;
  created_at: string;
}

export interface HostListingCreateInput {
  title: string;
  description: string;
  property_type: string;
  room_type: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  cleaning_fee?: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  photo_urls: string[];
  amenity_ids?: number[];
  category_ids?: number[];
}
