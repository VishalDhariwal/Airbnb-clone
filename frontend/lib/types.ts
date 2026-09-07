/**
 * Shared TypeScript type definitions for Airbnb Clone.
 * Mirrors FastAPI Pydantic schemas.
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
  avatar_url?: string;
  is_host: boolean;
  is_superhost: boolean;
  bio?: string;
  joined_at?: string;
  response_rate?: number;
  created_at: string;
}
