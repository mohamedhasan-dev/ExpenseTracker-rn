import { API_URL } from "@/services/api";

export default async function login(
  nameoremail: string,
  password: string,
): Promise<string | false> {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameoremail,
        password,
      }),
    });
    if (!res.ok) {
      return false;
    }
    const token = await res.json();
    if (token.token) {
      return token.token;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<{ token: string } | { error: string }> {
  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && typeof data.token === "string") {
      return { token: data.token };
    }
    if (res.status === 409) {
      return { error: "That username or email is already taken" };
    }
    return { error: data.message ?? "Couldn't create your account" };
  } catch (error) {
    console.error(error);
    return { error: "Can't reach the server. Check your connection." };
  }
}
