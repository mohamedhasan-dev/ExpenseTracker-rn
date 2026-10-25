import useTheme from "@/hooks/useTheme";
import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQueryClient } from "@tanstack/react-query";
import IncomeExpense from "./components/IncomeExpense";
import Spendings from "./components/Spendings";
import Recent_Transactions from "./components/Recent_Transactions";
import {
  errorMessage,
  staleDataMessage,
  useCurrentUser,
  useMonthlySummary,
  useTransactions,
} from "@/services/queries";
import ErrorBanner from "@/components/ErrorBanner";
import { monthRange } from "@/services/date";
import { summarize } from "@/services/transactions";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { colors } = useTheme();
  // Cached + refreshed in the background (see services/queries.ts)
  const userQuery = useCurrentUser();
  const user = userQuery.data?.user_name ?? "";

  const now = new Date();
  const month = now.toLocaleString("en-IN", { month: "long" }).toUpperCase();

  // Totals + month-over-month % come from the server; this month's list feeds
  // the category breakdown; plus the latest 5 for Recent
  const summaryQuery = useMonthlySummary(now);
  const thisMonthQuery = useTransactions(monthRange(now));
  const recentQuery = useTransactions({ limit: 5 });

  const current = summarize(thisMonthQuery.data ?? []);
  const totals = summaryQuery.data?.current ?? current; // list totals until the summary arrives
  const change = summaryQuery.data?.change ?? { income: null, expense: null };
  // Month-to-date by default for the current month (1..today vs 1..same day last month)
  const periodLabel =
    summaryQuery.data?.comparison === "full-month"
      ? "last month"
      : "the same period last month";

  // One banner for any failed request; cached numbers stay visible underneath
  const failedQuery = [summaryQuery, thisMonthQuery, recentQuery, userQuery].find(
    (q) => q.isError,
  );
  const showingSavedData =
    thisMonthQuery.data !== undefined || recentQuery.data !== undefined;

  // Pull to refresh: refetch everything on screen
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      }
    >
      <Text style={[styles.month, { color: colors.textMuted }]}>{month}</Text>
      <View style={styles.header}>
        <Text
          style={[styles.greetings, { color: colors.text }]}
          numberOfLines={1}
        >
          {getGreeting()}
          {user ? `, ${user}` : ""}
        </Text>
        <View
          style={[
            styles.avatar,
            { borderColor: colors.accent, backgroundColor: colors.accent },
          ]}
        >
          {user ? (
            <Text style={[styles.avatar_text, { color: colors.onAccent }]}>
              {user.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <MaterialCommunityIcons name="account" size={20} color={colors.onAccent} />
          )}
        </View>
      </View>
      <View style={styles.content}>
        {failedQuery && (
          <ErrorBanner
            message={
              showingSavedData
                ? staleDataMessage(failedQuery.error)
                : errorMessage(failedQuery.error, "Couldn't load your latest data.")
            }
            onRetry={onRefresh}
            retrying={refreshing}
          />
        )}
        <IncomeExpense
          income={totals.income}
          expense={totals.expense}
          incomeChange={change.income}
          expenseChange={change.expense}
          periodLabel={periodLabel}
        />
        <Spendings
          categories={current.expenseByCategory}
          total={current.expense}
        />
        <Recent_Transactions
          transactions={recentQuery.data ?? []}
          isLoading={recentQuery.isPending && !recentQuery.isError}
          hasError={recentQuery.isError && recentQuery.data === undefined}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  content: {
    gap: 16,
  },
  month: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  greetings: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar_text: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Dashboard;
