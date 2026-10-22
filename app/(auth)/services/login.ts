import { API_URL } from "@/services/api";
import {
  ApiError,
  errorMessage,
  fetchWithTimeout,
  isApiError,
  readJson,
} from "@/services/http";

/** Never throws: failures come back as a message the screen can show */
export type AuthResult =
  | { ok: true; token: string }
  | { ok: false; error: string; invalidCredentials?: boolean };

async function requestToken(path: string, body: object): Promise<string> {
  const response = await fetchWithTimeout(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await readJson<{ token?: unknown }>(response);
  if (typeof data.token !== "string") {
    throw new ApiError(response.status, "The server sent an unexpected response.");
  }
  return data.token;
}

export default async function login(
  nameoremail: string,
  password: string,
): Promise<AuthResult> {
  try {
    const token = await requestToken("/login", { nameoremail, password });
    return { ok: true, token };
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      return {
        ok: false,
        error: "Incorrect username/email or password.",
        invalidCredentials: true,
      };
    }
    return { ok: false, error: errorMessage(error, "Couldn't log you in. Please try again.") };
  }
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const token = await requestToken("/signup", { name, email, password });
    return { ok: true, token };
  } catch (error) {
    if (isApiError(error) && error.status === 409) {
      return { ok: false, error: "That username or email is already taken." };
    }
    return {
      ok: false,
      error: errorMessage(error, "Couldn't create your account. Please try again."),
    };
  }
}
