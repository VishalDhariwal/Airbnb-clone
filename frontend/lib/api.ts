/**
 * Centralized API client for Airbnb Clone.
 *
 * CONVENTION:
 * NEXT_PUBLIC_API_URL is configured as the base origin without a trailing /api
 * (e.g. "http://localhost:8000").
 * This client prepends "/api" internally to all relative paths.
 * Therefore, consumers must call endpoints as:
 *   api.get('/health')
 * NEVER:
 *   api.get('/api/health')
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiErrorPayload {
  detail?: string;
  code?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  public status: number;
  public data: ApiErrorPayload;

  constructor(status: number, message: string, data: ApiErrorPayload = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, ...customOptions } = options;

  // Clean path and ensure /api prefix
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const apiPath = cleanPath.startsWith("/api/")
    ? cleanPath
    : `/api${cleanPath}`;

  // Build complete URL with search params if present
  const url = new URL(`${BASE_URL}${apiPath}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Inject headers and Bearer token if present
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
    ...customOptions,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiErrorPayload = {};
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      errorData = await response.json();
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      }
    } catch {
      // Body was not JSON; use default message
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  // If response is 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: "GET" });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};
