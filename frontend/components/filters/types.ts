export interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  roomType: string | null;
  propertyType: string | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  amenityIds: number[];
}

export const ROOM_TYPES = [
  { label: "Any type", value: null },
  { label: "Room", value: "private" },
  { label: "Entire home", value: "entire" },
];

export const PROPERTY_TYPES = [
  { label: "House", value: "house" },
  { label: "Flat / Apartment", value: "flat" },
  { label: "Villa", value: "villa" },
  { label: "Hotel", value: "hotel" },
  { label: "Cabin", value: "cabin" },
  { label: "Mansion", value: "mansion" },
];

export const AMENITY_OPTIONS = [
  { id: 1, name: "Wi-Fi" },
  { id: 2, name: "Air conditioning" },
  { id: 3, name: "Kitchen" },
  { id: 4, name: "Free parking" },
  { id: 5, name: "Dedicated workspace" },
  { id: 6, name: "Pool" },
  { id: 11, name: "Mountain view" },
  { id: 12, name: "Beach access" },
];

export const COUNT_OPTIONS = [null, 1, 2, 3, 4, 5, 6, 7, 8];
