import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import amount from "../../services/amount";

interface TransactionsSummaryProps {
  /** e.g. "October 2026", "Today", "This week", "12 Oct – 18 Oct" */
  periodLabel: string;
  income: number;
  expense: number;
  onPressPeriod: () => void;
}

/** One compact card: period, total expenses (focus), income and the difference */
const TransactionsSummary = ({
  periodLabel,
  income,
  expense,
  onPressPeriod,
}: TransactionsSummaryProps) => {
  const { colors } = useTheme();
  const net = income - expense;
  const netLabel =
    net === 0 ? amount(0) : `${net > 0 ? "+" : "\u2212"}${amount(Math.abs(net))}`;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.surface2 },
      ]}
    >
      <Pressable
        onPress={onPressPeriod}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Period: ${periodLabel}. Change month`}
        style={styles.periodRow}
      >
        <Text style={[styles.period, { color: colors.text }]} numberOfLines={1}>
          {periodLabel.toUpperCase()}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color={colors.text} style={{ opacity: 0.7 }} />
      </Pressable>

      <Text style={[styles.label, { color: colors.text }]}>Total expenses</Text>
      <Text
        style={[styles.total, { color: colors.text }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {amount(expense)}
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.surface2 }]} />

      <View style={styles.bottomRow}>
        <View style={styles.flexCell}>
          <Text style={[styles.label, { color: colors.text }]}>Income</Text>
          <Text
            style={[styles.value, { color: colors.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {amount(income)}
          </Text>
        </View>
        <View style={[styles.flexCell, { alignItems: "flex-end" }]}>
          <Text style={[styles.label, { color: colors.text }]}>Difference</Text>
          <Text
            style={[styles.value, { color: net < 0 ? colors.accent : colors.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {netLabel}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  period: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    opacity: 0.8,
  },
  label: {
    fontSize: 12,
    opacity: 0.55,
  },
  total: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 16,
  },
  flexCell: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
});

export default TransactionsSummary;
