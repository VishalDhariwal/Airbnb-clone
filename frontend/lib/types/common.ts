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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
