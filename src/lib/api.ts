/**
 * Small helper for calling the Express API server.
 *
 * - Public routes (services list / details) are fetched without a token.
 * - Private routes (bookings, profile, ...) automatically fetch a JWT from
 *   /api/auth/token (which is issued from the Better Auth session cookie)
 *   and send it as "Authorization: Bearer <token>".
 */

/** Base URL of the Express API (set in .env as NEXT_PUBLIC_API_URL). */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** Cached token so we don't request a new one on every API call. */
let cachedToken: string | null = null;

/** Requests a fresh JWT from our own /api/auth/token route. */
async function getToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  try {
    const res = await fetch("/api/auth/token", { method: "GET" });
    if (!res.ok) return null;

    const data = await res.json();
    cachedToken = data.token ?? null;
    return cachedToken;
  } catch {
    return null;
  }
}

/** Clears the cached token (called after sign out). */
export function clearToken() {
  cachedToken = null;
}

type ApiOptions = {
  /** JSON body — will be stringified automatically. */
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Send the Authorization header (default: false for GET, true otherwise). */
  auth?: boolean;
};

/**
 * Calls the Express API and returns the parsed JSON response.
 * Throws an Error with the server's message when the request fails,
 * so pages can show a proper toast / error state.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { body, method, auth } = options;
  const needsAuth = auth ?? method !== undefined;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (needsAuth) {
    const token = await getToken();
    if (!token) {
      throw new Error("Please sign in to continue.");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: method ?? "GET",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Token may have expired — drop it so the next call fetches a new one
      if (res.status === 401) cachedToken = null;
      throw new Error(data.message || `Request failed (${res.status}).`);
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      // fetch itself failed — the API server is probably not running
      throw new Error("Could not reach the server. Please try again later.");
    }
    throw error;
  }
}
