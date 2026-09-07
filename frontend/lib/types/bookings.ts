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
