/**
 * Network helpers shared by every request in the app:
 * timeouts, typed errors, and user-facing error messages.
 */

/** Give up on a request after this long (a wrong IP or sleeping server would otherwise hang forever) */
export const REQUEST_TIMEOUT_MS = 15_000;

/** The server answered, but with an error status (4xx / 5xx) */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** No answer at all: offline, wrong API_URL, server down, or timed out */
export class NetworkError extends Error {
  timedOut: boolean;
  constructor(timedOut: boolean) {
    super(timedOut ? "Request timed out" : "Network request failed");
    this.name = "NetworkError";
    this.timedOut = timedOut;
  }
}

/** The saved login is no longer valid (missing token or HTTP 401) */
export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}

// Checked by name rather than instanceof, which is unreliable for transpiled Error subclasses
const hasName = (error: unknown, name: string) =>
  typeof error === "object" &&
  error !== null &&
  (error as { name?: unknown }).name === name;

export const isApiError = (e: unknown): e is ApiError => hasName(e, "ApiError");
export const isNetworkError = (e: unknown): e is NetworkError =>
  hasName(e, "NetworkError");
export const isSessionExpired = (e: unknown): e is SessionExpiredError =>
  hasName(e, "SessionExpiredError");

/** fetch() with a timeout; throws NetworkError when no response arrives */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    // fetch only rejects when there was no response at all
    throw new NetworkError(controller.signal.aborted);
  } finally {
    clearTimeout(timer);
  }
}

/** Parses a JSON response; throws ApiError (with the server's message) on error statuses */
export async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body?.message === "string"
        ? body.message
        : `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }
  if (body === null) {
    throw new ApiError(response.status, "The server sent an unexpected response.");
  }
  return body as T;
}

/** A message that is safe and useful to show the user for any error */
export function errorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (isNetworkError(error)) {
    return error.timedOut
      ? "The server is taking too long to respond. Please try again."
      : "Can't reach the server. Check your internet connection and try again.";
  }
  if (isSessionExpired(error)) {
    return "Your session has expired. Please log in again.";
  }
  if (isApiError(error)) {
    if (error.status >= 500) {
      return "Something went wrong on our side. Please try again in a moment.";
    }
    return error.message; // 4xx messages from our API are written for users
  }
  return fallback;
}

/** Short banner text for a failed refresh while older data is still on screen */
export function staleDataMessage(error: unknown) {
  if (isNetworkError(error)) {
    return error.timedOut
      ? "Showing saved data (server is slow)."
      : "Showing saved data (can't reach server).";
  }
  if (isSessionExpired(error)) return "Showing saved data (session expired).";
  if (isApiError(error) && error.status >= 500) {
    return "Showing saved data (server error).";
  }
  return "Showing saved data (couldn't refresh).";
}

/** Only retry failures that might succeed on a second try */
export const shouldRetry = (failureCount: number, error: unknown) => {
  if (isSessionExpired(error)) return false;
  if (isApiError(error) && error.status < 500) return false;
  return failureCount < 2;
};
