import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import amount from "../../services/amount";
import { formatRelativeDate, formatTime } from "@/services/date";
import { isIncome } from "@/services/transactions";
import type { Transaction } from "@/services/queries";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const isIconName = (name: string | undefined): name is IconName =>
  !!name && name in MaterialCommunityIcons.glyphMap;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface TransactionRowProps {
  transaction: Transaction;
  /**
   * "compact" (Dashboard card): "Food · Today, 2:40 pm".
   * "history" (Transactions list, grouped by day): "UPI · Food".
   * Amounts: income in primary (mist blue), expenses in expense (blossom red) everywhere.
   */
  variant?: "compact" | "history";
}

const TransactionRow = ({
  transaction: t,
  variant = "compact",
}: TransactionRowProps) => {
  const { colors } = useTheme();
  const income = isIncome(t);
  const icon: IconName = isIconName(t.category?.icon)
    ? t.category.icon
    : income
      ? "arrow-up"
      : "arrow-down";
  const categoryName = t.category?.name ?? capitalize(t.type);
  const title = t.description || categoryName;

  // Secondary line: history rows show how it was paid (the day is in the section header)
  const meta =
    variant === "history"
      ? [
          t.paymentMethod,
          // Avoid repeating the category when it's already the title
          title === categoryName ? formatTime(new Date(t.date)) : categoryName,
        ]
          .filter(Boolean)
          .join(" · ")
      : `${categoryName} · ${formatRelativeDate(t.date)}`;

  const amountColor = income ? colors.primary : colors.expense;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${title}, ${meta}, ${income ? "income" : "expense"} ${amount(
        Math.abs(Number(t.amount)),
      )}`}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor:
              variant === "history" ? colors.surface : colors.background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={amountColor}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text numberOfLines={1} style={[styles.meta, { color: colors.textMuted }]}>
          {meta}
        </Text>
      </View>

      <Text numberOfLines={1} style={[styles.amount, { color: amountColor }]}>
        {income ? "+" : "\u2212"}
        {amount(Math.abs(Number(t.amount)))}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 0,
    maxWidth: "45%",
  },
});

export default React.memo(TransactionRow);
