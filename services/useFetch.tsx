import useAuth from "@/hooks/useAuth";
import { useCallback } from "react";
import { fetchWithTimeout, SessionExpiredError } from "@/services/http";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Authenticated fetch. Throws NetworkError when the server can't be reached and
 * SessionExpiredError (after logging out) when the token is missing or rejected.
 */
function useFetch() {
  const { authenticate, logout } = useAuth();

  const fetchAPI = useCallback(
    async (url: string, method: HttpMethod, body?: unknown) => {
      if (!authenticate.Token) {
        throw new SessionExpiredError();
      }

      const response = await fetchWithTimeout(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticate.Token}`,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      if (response.status === 401) {
        logout();
        throw new SessionExpiredError();
      }

      return response;
    },
    [authenticate.Token, logout]
  );

  return fetchAPI;
}

export default useFetch;
