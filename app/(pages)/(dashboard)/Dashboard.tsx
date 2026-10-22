import useTheme from "@/hooks/useTheme";
import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQueryClient } from "@tanstack/react-query";
import IncomeExpense from "./components/IncomeExpense";
import Spendings from "./components/Spendings";
import Recent_Transactions from "./components/Recent_Transactions";
import { useCurrentUser, useTransactions } from "@/services/queries";
import { monthRange, startOfMonth } from "@/services/date";
import { percentChange, summarize } from "@/services/transactions";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { colors } = useTheme();
  // Cached + refreshed in the background (see services/queries.ts)
  const { data: currentUser } = useCurrentUser();
  const user = currentUser?.user_name ?? "";

  const now = new Date();
  const month = now.toLocaleString("en-IN", { month: "long" }).toUpperCase();

  // This month (totals + categories), last month (for the % badges), and the latest 5
  const { data: thisMonth = [] } = useTransactions(monthRange(now));
  const { data: lastMonth = [] } = useTransactions(
    monthRange(startOfMonth(now, -1)),
  );
  const { data: recent = [], isPending: recentLoading } = useTransactions({
    limit: 5,
  });

  const current = summarize(thisMonth);
  const previous = summarize(lastMonth);

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
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={colors.surface}
        />
      }
    >
      <Text style={[styles.month, { color: colors.text }]}>{month}</Text>
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
            { borderColor: colors.accent, backgroundColor: colors.surface },
          ]}
        >
          {user ? (
            <Text style={[styles.avatar_text, { color: colors.accent }]}>
              {user.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <MaterialCommunityIcons name="account" size={20} color={colors.accent} />
          )}
        </View>
      </View>
      <View style={styles.content}>
        <IncomeExpense
          income={current.income}
          expense={current.expense}
          incomeChange={percentChange(current.income, previous.income)}
          expenseChange={percentChange(current.expense, previous.expense)}
        />
        <Spendings
          categories={current.expenseByCategory}
          total={current.expense}
        />
        <Recent_Transactions transactions={recent} isLoading={recentLoading} />
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
    opacity: 0.55,
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
