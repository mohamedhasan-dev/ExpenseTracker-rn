import type { Transaction } from "@/services/queries";
import { dayKey, formatDayHeading } from "@/services/date";

/** Old rows were saved lower-case, so compare case-insensitively */
export const isIncome = (t: Pick<Transaction, "type">) =>
  t.type.toLowerCase() === "income";

export const toNumber = (amount: string | number) => {
  const n = Number(amount);
  return Number.isFinite(n) ? n : 0;
};

export type CategoryTotal = {
  id: string;
  name: string;
  icon: string;
  total: number;
};

/** Income/expense totals and expense totals per category (largest first) */
export function summarize(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;
  const byCategory = new Map<string, CategoryTotal>();

  for (const t of transactions) {
    const value = toNumber(t.amount);
    if (isIncome(t)) {
      income += value;
      continue;
    }
    expense += value;
    const key = t.category?.id ?? "uncategorised";
    const entry = byCategory.get(key) ?? {
      id: key,
      name: t.category?.name ?? "Other",
      icon: t.category?.icon ?? "shape-outline",
      total: 0,
    };
    entry.total += value;
    byCategory.set(key, entry);
  }

  return {
    income,
    expense,
    expenseByCategory: [...byCategory.values()].sort(
      (a, b) => b.total - a.total,
    ),
  };
}

export type TransactionTypeFilter = "All" | "Expense" | "Income";

export type TransactionFilter = {
  type: TransactionTypeFilter;
  categoryIds: string[]; // empty = any category
  paymentMethods: string[]; // empty = any method
  search: string;
};

/** Type tab + category + payment method + free-text search (description, category, method, amount) */
export function filterTransactions(
  transactions: Transaction[],
  filter: TransactionFilter,
) {
  const query = filter.search.trim().toLowerCase();
  return transactions.filter((t) => {
    if (filter.type !== "All" && isIncome(t) !== (filter.type === "Income")) {
      return false;
    }
    if (
      filter.categoryIds.length > 0 &&
      !filter.categoryIds.includes(t.category?.id ?? "")
    ) {
      return false;
    }
    if (
      filter.paymentMethods.length > 0 &&
      !filter.paymentMethods.includes(t.paymentMethod)
    ) {
      return false;
    }
    if (query) {
      const haystack = [t.description, t.category?.name, t.paymentMethod, t.amount]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export type DaySection = {
  key: string;
  title: string;
  income: number;
  expense: number;
  data: Transaction[];
};

/** Groups transactions (already newest first) into one section per local day */
export function groupByDay(transactions: Transaction[]): DaySection[] {
  const sections: DaySection[] = [];
  for (const t of transactions) {
    const date = new Date(t.date);
    const key = dayKey(date);
    let section = sections[sections.length - 1];
    if (!section || section.key !== key) {
      section = {
        key,
        title: formatDayHeading(date),
        income: 0,
        expense: 0,
        data: [],
      };
      sections.push(section);
    }
    section.data.push(t);
    if (isIncome(t)) section.income += toNumber(t.amount);
    else section.expense += toNumber(t.amount);
  }
  return sections;
}
