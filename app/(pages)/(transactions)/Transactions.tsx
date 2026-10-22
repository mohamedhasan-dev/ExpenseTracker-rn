import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import BackButton from "@/components/BackButton";
import SegmentedToggle from "./components/SegmentedToggle";
import TransactionRow from "./components/TransactionRow";
import { errorMessage, useTransactions } from "@/services/queries";
import amount from "../services/amount";
import {
  formatMonth,
  isSameMonth,
  monthRange,
  startOfMonth,
} from "@/services/date";
import { groupByDay, isIncome, summarize } from "@/services/transactions";

const FILTERS = ["All", "Expense", "Income"] as const;
type Filter = (typeof FILTERS)[number];

const Transactions = () => {
  const { colors } = useTheme();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [filter, setFilter] = useState<Filter>("All");

  const { data = [], isPending, isError, error, refetch, isRefetching } =
    useTransactions(monthRange(month));

  const totals = summarize(data);
  const visible =
    filter === "All"
      ? data
      : data.filter((t) => isIncome(t) === (filter === "Income"));
  const sections = groupByDay(visible);
  const isCurrentMonth = isSameMonth(month, new Date());

  const emptyState = isPending ? (
    <ActivityIndicator style={styles.empty} color={colors.accent} />
  ) : isError ? (
    <Pressable style={styles.empty} onPress={() => refetch()}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {errorMessage(error, "Couldn't load transactions.")} Tap to retry.
      </Text>
    </Pressable>
  ) : (
    <Text style={[styles.empty, styles.emptyText, { color: colors.text }]}>
      {filter === "All"
        ? "No transactions this month"
        : `No ${filter.toLowerCase()}s this month`}
    </Text>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Month switcher */}
      <View style={styles.monthRow}>
        <Pressable
          accessibilityLabel="Previous month"
          hitSlop={10}
          onPress={() => setMonth((m) => startOfMonth(m, -1))}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.monthLabel, { color: colors.text }]}>
          {formatMonth(month)}
        </Text>
        <Pressable
          accessibilityLabel="Next month"
          hitSlop={10}
          disabled={isCurrentMonth}
          onPress={() => setMonth((m) => startOfMonth(m, 1))}
          style={{ opacity: isCurrentMonth ? 0.25 : 1 }}
        >
          <MaterialCommunityIcons name="chevron-right" size={28} color={colors.text} />
        </Pressable>
      </View>

      {/* Month totals */}
      <View style={[styles.totals, { backgroundColor: colors.surface }]}>
        <View style={styles.totalItem}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Income</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>
            {amount(totals.income)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.background }]} />
        <View style={styles.totalItem}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Expenses</Text>
          <Text style={[styles.totalValue, { color: colors.accent }]}>
            {amount(totals.expense)}
          </Text>
        </View>
      </View>

      <SegmentedToggle options={FILTERS} activeOption={filter} onChange={setFilter} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionRow transaction={item} dateFormat="time" />
        )}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionTotal, { color: colors.text }]}>
              {section.expense > 0 ? `-${amount(section.expense)}` : ""}
              {section.expense > 0 && section.income > 0 ? "  " : ""}
              {section.income > 0 ? `+${amount(section.income)}` : ""}
            </Text>
          </View>
        )}
        stickySectionHeadersEnabled
        ListEmptyComponent={emptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isPending}
            onRefresh={() => refetch()}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
  },
  headerSpacer: {
    width: 34,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 4,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totals: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  totalItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  totalLabel: {
    fontSize: 12,
    opacity: 0.55,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "700",
  },
  divider: {
    width: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.7,
  },
  sectionTotal: {
    fontSize: 12,
    opacity: 0.55,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  empty: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    opacity: 0.55,
    textAlign: "center",
  },
});

export default Transactions;
