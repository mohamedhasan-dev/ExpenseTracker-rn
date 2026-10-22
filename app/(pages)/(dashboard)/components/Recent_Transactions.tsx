import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import { router } from "expo-router";
import TransactionRow from "../../(transactions)/components/TransactionRow";
import type { Transaction } from "@/services/queries";

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
  /** Request failed and nothing is cached (the screen shows the error banner) */
  hasError?: boolean;
}

const Recent_Transactions = ({
  transactions,
  isLoading,
  hasError,
}: RecentTransactionsProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Recent</Text>
        <Pressable hitSlop={8} onPress={() => router.navigate("/Transactions")}>
          <Text style={[styles.see_all, { color: colors.accent }]}>
            See all
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {transactions.length === 0 &&
          (isLoading ? (
            <ActivityIndicator style={styles.empty} color={colors.accent} />
          ) : hasError ? (
            <Text style={[styles.empty, { color: colors.text }]}>
              Couldn&apos;t load your transactions.
            </Text>
          ) : (
            <Text style={[styles.empty, { color: colors.text }]}>
              No transactions yet. Tap + to add one.
            </Text>
          ))}
        {transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  see_all: {
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  empty: {
    opacity: 0.55,
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default Recent_Transactions;
