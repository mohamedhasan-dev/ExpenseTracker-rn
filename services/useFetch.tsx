import useAuth from "@/hooks/useAuth";
import { useCallback } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function useFetch() {
  const { authenticate, logout } = useAuth();

  const fetchAPI = useCallback(
    async (url: string, method: HttpMethod) => {
      if (!authenticate.Token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticate.Token}`,
        },
      });

      if (response.status === 401) {
        logout();
        throw new Error("Session expired");
      }

      return response;
    },
    [authenticate.Token, logout]
  );

  return fetchAPI;
}

export default useFetch;