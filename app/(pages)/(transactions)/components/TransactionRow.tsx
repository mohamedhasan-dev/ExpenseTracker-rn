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
  /** "relative" = "Today, 2:40 pm" / "14 Oct"; "time" = "2:40 pm" (for lists grouped by day) */
  dateFormat?: "relative" | "time";
}

const TransactionRow = ({
  transaction: t,
  dateFormat = "relative",
}: TransactionRowProps) => {
  const { colors } = useTheme();
  const income = isIncome(t);
  const icon: IconName = isIconName(t.category?.icon)
    ? t.category.icon
    : income
      ? "arrow-up"
      : "arrow-down";
  const when =
    dateFormat === "time"
      ? formatTime(new Date(t.date))
      : formatRelativeDate(t.date);

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={income ? colors.primary : colors.accent}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {t.description || t.category?.name || capitalize(t.type)}
        </Text>
        <Text numberOfLines={1} style={[styles.meta, { color: colors.text }]}>
          {t.category?.name ?? capitalize(t.type)} · {when}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: income ? colors.primary : colors.text },
        ]}
      >
        {income ? "+" : "-"}
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
    opacity: 0.55,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default React.memo(TransactionRow);
