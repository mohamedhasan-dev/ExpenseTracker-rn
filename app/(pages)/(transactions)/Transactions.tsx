import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useDeferredValue, useMemo, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import SegmentedToggle from "./components/SegmentedToggle";
import TransactionRow from "./components/TransactionRow";
import TransactionsSummary from "./components/TransactionsSummary";
import FilterSheet, {
  AdvancedFilters,
  countActiveFilters,
  defaultFilters,
} from "./components/FilterSheet";
import MonthPickerSheet from "./components/MonthPickerSheet";
import { errorMessage, useTransactions } from "@/services/queries";
import ErrorBanner from "@/components/ErrorBanner";
import {
  dayRange,
  formatMonth,
  formatShortDate,
  isSameMonth,
  monthRange,
  startOfMonth,
  startOfWeek,
} from "@/services/date";
import {
  filterTransactions,
  groupByDay,
  summarize,
  type TransactionTypeFilter,
} from "@/services/transactions";

const TYPE_TABS = ["All", "Expense", "Income"] as const;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** The date window to fetch: the selected month, or the date-range filter */
function getRange(filters: AdvancedFilters, month: Date) {
  const today = new Date();
  switch (filters.datePreset) {
    case "today":
      return dayRange(today, today);
    case "week":
      return dayRange(startOfWeek(today), today);
    case "custom":
      return dayRange(filters.customFrom, filters.customTo);
    default:
      return monthRange(month);
  }
}

function getPeriodLabel(filters: AdvancedFilters, month: Date) {
  switch (filters.datePreset) {
    case "today":
      return "Today";
    case "week":
      return "This week";
    case "custom":
      return `${formatShortDate(filters.customFrom)} \u2013 ${formatShortDate(filters.customTo)}`;
    default:
      return formatMonth(month);
  }
}

const Transactions = () => {
  const { colors, isDarkMode } = useTheme();

  // Screen state: month, type tab, search, sheet filters, which sheet is open
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [typeTab, setTypeTab] = useState<TransactionTypeFilter>("All");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search); // keeps typing smooth on long lists
  const [filters, setFilters] = useState<AdvancedFilters>(defaultFilters);
  const [sheet, setSheet] = useState<"filters" | "month" | null>(null);

  const query = useTransactions(getRange(filters, month));
  const { isPending, isError, error, refetch, isRefetching } = query;
  const data = useMemo(() => query.data ?? [], [query.data]);
  // Refresh failed but an older copy is on screen: say so instead of failing silently
  const staleError = isError && query.data !== undefined;

  // Summary covers the whole period; tabs/search/filters only narrow the history list
  const totals = summarize(data);
  const visible = useMemo(
    () =>
      filterTransactions(data, {
        type: typeTab,
        categoryIds: filters.categoryIds,
        paymentMethods: filters.paymentMethods,
        search: deferredSearch,
      }),
    [data, typeTab, filters.categoryIds, filters.paymentMethods, deferredSearch],
  );
  const sections = useMemo(() => groupByDay(visible), [visible]);

  const activeFilterCount = countActiveFilters(filters);
  const isNarrowed =
    typeTab !== "All" ||
    deferredSearch.trim() !== "" ||
    filters.categoryIds.length > 0 ||
    filters.paymentMethods.length > 0;
  const isCurrentMonth = isSameMonth(month, new Date());
  const periodLabel = getPeriodLabel(filters, month);

  const clearAll = () => {
    setSearch("");
    setTypeTab("All");
    setFilters(defaultFilters());
  };

  const listHeader = (
    <View>
      <TransactionsSummary
        periodLabel={periodLabel}
        income={totals.income}
        expense={totals.expense}
        onPressPeriod={() => setSheet("month")}
      />

      <SegmentedToggle options={TYPE_TABS} activeOption={typeTab} onChange={setTypeTab} />

      {/* Search + filter */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.surface2 },
          ]}
        >
          <MaterialCommunityIcons name="magnify" size={20} color={colors.text} style={{ opacity: 0.55 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search transactions..."
            // Same muted placeholder as StandardInput on the Add Transaction screen
            placeholderTextColor={
              isDarkMode ? "hsla(186, 70%, 91%, 0.45)" : "hsla(210, 26%, 15%, 0.45)"
            }
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Search transactions"
          />
          {search !== "" && (
            <Pressable
              hitSlop={10}
              onPress={() => setSearch("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.text} style={{ opacity: 0.55 }} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setSheet("filters")}
          accessibilityRole="button"
          accessibilityLabel={
            activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : "Filters"
          }
          style={({ pressed }) => [
            styles.filterButton,
            {
              backgroundColor: colors.surface,
              borderColor: activeFilterCount > 0 ? colors.accent : colors.surface2,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={18}
            color={activeFilterCount > 0 ? colors.accent : colors.text}
          />
          <Text
            style={[
              styles.filterText,
              { color: activeFilterCount > 0 ? colors.accent : colors.text },
            ]}
          >
            Filter
          </Text>
          {activeFilterCount > 0 && (
            <View style={[styles.filterCount, { backgroundColor: colors.accent }]}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {activeFilterCount > 0 && (
        <View style={styles.activeRow}>
          <Text style={[styles.muted, { color: colors.text }]}>
            {plural(activeFilterCount, "filter")} active
          </Text>
          <Pressable
            hitSlop={8}
            onPress={() => setFilters(defaultFilters())}
            accessibilityRole="button"
          >
            <Text style={[styles.link, { color: colors.accent }]}>Clear filters</Text>
          </Pressable>
        </View>
      )}

      {staleError && (
        <View style={{ marginTop: 12 }}>
          <ErrorBanner
            message={`${errorMessage(error, "Couldn't refresh.")} Showing saved data.`}
            onRetry={() => refetch()}
            retrying={isRefetching}
          />
        </View>
      )}

      <View style={styles.historyRow}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>History</Text>
        <Text style={[styles.muted, { color: colors.text }]}>
          {isNarrowed ? plural(visible.length, "result") : "Newest first"}
        </Text>
      </View>
    </View>
  );

  const emptyState = isPending ? (
    <ActivityIndicator style={styles.empty} color={colors.accent} />
  ) : isError ? (
    <Pressable style={styles.empty} onPress={() => refetch()}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {errorMessage(error, "Couldn't load transactions.")} Tap to retry.
      </Text>
    </Pressable>
  ) : data.length > 0 ? (
    // There is data for the period, but search/filters hide all of it
    <View style={styles.empty}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        No transactions match your search or filters.
      </Text>
      <Pressable hitSlop={8} onPress={clearAll} accessibilityRole="button">
        <Text style={[styles.link, { color: colors.accent, marginTop: 8 }]}>
          Clear search and filters
        </Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.empty}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        No transactions {filters.datePreset === "month" ? `in ${periodLabel}` : `for ${periodLabel.toLowerCase()}`}.
      </Text>
      <Text style={[styles.emptyText, { color: colors.text, marginTop: 4 }]}>
        Tap + to add one.
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Track your money</Text>
        </View>
        <Pressable
          onPress={() => setSheet("month")}
          accessibilityRole="button"
          accessibilityLabel="Select month"
          style={({ pressed }) => [
            styles.calendarButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.surface2,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="calendar-month-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => <TransactionRow transaction={item} variant="history" />}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.sectionHeader,
              section.key !== sections[0]?.key && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.surface2,
                marginTop: 8,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.muted, { color: colors.text }]}>
              {plural(section.data.length, "transaction")}
            </Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={emptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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

      <FilterSheet
        visible={sheet === "filters"}
        filters={filters}
        typeTab={typeTab}
        monthLabel={isCurrentMonth ? "This month" : formatMonth(month)}
        onApply={(next) => {
          setFilters(next);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <MonthPickerSheet
        visible={sheet === "month"}
        selected={month}
        onSelect={(next) => {
          setMonth(next);
          // Picking a month switches the date range back to that month
          setFilters((f) => ({ ...f, datePreset: "month" }));
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.55,
    marginTop: 2,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    minWidth: 0,
    height: 48,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0, // Android adds vertical padding by default
  },
  filterButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterCountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  activeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  muted: {
    fontSize: 12,
    opacity: 0.55,
  },
  link: {
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
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
