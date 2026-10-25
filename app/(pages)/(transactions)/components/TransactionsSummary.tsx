import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import amount from "../../services/amount";

interface TransactionsSummaryProps {
  /** e.g. "Oct 2026", "Today", "This week", "12 Oct – 18 Oct" */
  periodLabel: string;
  income: number;
  expense: number;
  onPressPeriod: () => void;
}

/** One row: period selector (left), income | expense totals (right), divider below */
const TransactionsSummary = ({
  periodLabel,
  income,
  expense,
  onPressPeriod,
}: TransactionsSummaryProps) => {
  const { colors } = useTheme();

  const total = (
    label: string,
    value: number,
    dot: string,
    valueColor: string,
  ) => (
    <View style={styles.total}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: dot }]} />
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {amount(value)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { borderBottomColor: colors.surface2 }]}>
      <Pressable
        onPress={onPressPeriod}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Period: ${periodLabel}. Change month`}
        style={({ pressed }) => [styles.period, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text
          style={[styles.periodText, { color: colors.text }]}
          numberOfLines={1}
        >
          {periodLabel.toUpperCase()}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={18}
          color={colors.textMuted}
        />
      </Pressable>

      <View style={styles.totals}>
        {total("Expense", expense, colors.expense, colors.expense)}
        <View
          style={[styles.separator, { backgroundColor: colors.surface2 }]}
        />
        {total("Income", income, colors.primary, colors.primary)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 4,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  period: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  periodText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
    opacity: 0.85,
  },
  totals: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginLeft: "auto",
  },
  total: {
    alignItems: "flex-end",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
});

export default TransactionsSummary;
