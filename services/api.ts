// Base URL of the ExpenseTracker backend.
// Set EXPO_PUBLIC_API_URL in app/.env (e.g. EXPO_PUBLIC_API_URL=http://192.168.1.10:5001)
// to point at a different machine without editing code.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.192.164.54:5001";
