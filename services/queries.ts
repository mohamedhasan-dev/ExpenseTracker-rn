import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/services/useFetch";
import { API_URL } from "@/services/api";
import { isApiError, readJson } from "@/services/http";

// Re-exported so screens can import everything data-related from one place
export { ApiError, errorMessage } from "@/services/http";

const HOUR = 60 * 60 * 1000;

/* ---------- API shapes ---------- */

export type TransactionType = "Expense" | "Income";

export type Category = {
  id: string;
  userId: string | null; // null = app default
  name: string;
  icon: string; // MaterialCommunityIcons name
  type: TransactionType;
};

export type Transaction = {
  id: string;
  amount: string; // numeric column -> string
  description: string | null;
  type: TransactionType | Lowercase<TransactionType>; // older rows are lower-case
  date: string; // ISO timestamp
  paymentMethod: string;
  category: { id: string; name: string; icon: string };
};

export type CurrentUser = { id: string; user_name: string; email: string };

export type PaymentMethod = "UPI" | "Card" | "Cash" | "Bank";

/** Body for POST /transactions */
export type NewTransaction = {
  type: TransactionType;
  amount: number;
  categoryId: string;
  description?: string;
  date: string; // ISO timestamp
  paymentMethod: PaymentMethod;
};

export type SummaryComparison = "to-date" | "full";

/** GET /transactions/summary */
export type MonthlySummary = {
  month: string; // "2026-10"
  /** Current month: 1st..today vs 1st..same day last month. Past months: full months. */
  comparison: "month-to-date" | "full-month";
  range: { from: string; to: string }; // [from, to) in UTC
  previousRange: { from: string; to: string };
  current: { income: number; expense: number };
  previous: { income: number; expense: number };
  /** % change vs the previous period; null when the previous period was 0 */
  change: { income: number | null; expense: number | null };
};

/** Query params for GET /transactions */
export type TransactionFilters = {
  from?: string; // ISO, inclusive
  to?: string; // ISO, exclusive
  limit?: number; // 1-100
};

/* ---------- cache keys (use these for invalidation) ---------- */

export const queryKeys = {
  user: ["user"] as const,
  categories: ["categories"] as const,
  transactionsAll: ["transactions"] as const,
  transactions: (filters: TransactionFilters = {}) =>
    ["transactions", filters] as const,
  // Starts with "transactions", so saving a transaction refreshes it too
  summary: (month: string, compare: SummaryComparison | "default" = "default") =>
    ["transactions", "summary", month, compare] as const,
};

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

/**
 * Income/expense totals and % change vs last month, calculated by the server.
 * Sends the phone's UTC offset so months follow the user's time zone.
 * For the current month the server compares month-to-date by default;
 * pass compare="full" to compare whole months instead.
 */
export function useMonthlySummary(
  month: Date = new Date(),
  compare?: SummaryComparison,
) {
  const fetchAPI = useFetch();
  const { authenticate } = useAuth();
  const key = monthKey(month);
  const tzOffset = -month.getTimezoneOffset(); // minutes east of UTC (IST = 330)
  const params = new URLSearchParams({ month: key, tzOffset: String(tzOffset) });
  if (compare) params.set("compare", compare);
  return useQuery({
    queryKey: queryKeys.summary(key, compare),
    queryFn: async () =>
      readJson<MonthlySummary>(
        await fetchAPI(`${API_URL}/transactions/summary?${params}`, "GET"),
      ),
    enabled: !!authenticate.Token,
    staleTime: 30 * 1000,
  });
}

/* ---------- hooks ---------- */

export function useCurrentUser() {
  const fetchAPI = useFetch();
  const { authenticate } = useAuth();
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () =>
      readJson<CurrentUser>(await fetchAPI(`${API_URL}/users`, "GET")),
    enabled: !!authenticate.Token,
    staleTime: 24 * HOUR,
  });
}

// App defaults first, the user's own next, "Other" always last
const sortCategories = (list: Category[]) =>
  [...list].sort((a, b) => {
    const rank = (c: Category) =>
      c.name === "Other" ? 2 : c.userId === null ? 0 : 1;
    return rank(a) - rank(b);
  });

/**
 * Categories (names + icons). Served from the saved cache instantly on startup,
 * then refreshed in the background once the cached copy is older than staleTime.
 */
export function useCategories(type?: TransactionType) {
  const fetchAPI = useFetch();
  const { authenticate } = useAuth();
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () =>
      readJson<Category[]>(await fetchAPI(`${API_URL}/categories`, "GET")),
    enabled: !!authenticate.Token,
    staleTime: 12 * HOUR,
    select: (list) =>
      sortCategories(type ? list.filter((c) => c.type === type) : list),
  });
}

/** Saves a transaction, then refreshes every cached transaction list */
export function useCreateTransaction() {
  const fetchAPI = useFetch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewTransaction) =>
      readJson<unknown>(
        await fetchAPI(`${API_URL}/transactions`, "POST", input),
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionsAll }),
    onError: (error) => {
      // 403 = the chosen category no longer exists for this user: refresh the cached list
      if (isApiError(error) && error.status === 403) {
        queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      }
    },
  });
}

/** Transactions, newest first. Cached per filter combination. */
export function useTransactions(filters: TransactionFilters = {}) {
  const fetchAPI = useFetch();
  const { authenticate } = useAuth();
  return useQuery({
    queryKey: queryKeys.transactions(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.limit) params.set("limit", String(filters.limit));
      const query = params.toString();
      const url = `${API_URL}/transactions${query ? `?${query}` : ""}`;
      return readJson<Transaction[]>(await fetchAPI(url, "GET"));
    },
    enabled: !!authenticate.Token,
    staleTime: 30 * 1000,
  });
}
