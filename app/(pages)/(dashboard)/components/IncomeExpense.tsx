import { View, Text, StyleSheet } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import BlurCard from "@/components/BlurCard";
import Badge from "@/components/Badge";
import amount, { splitAmount } from "../../services/amount";
import ProgressBar from "@/components/ProgressBar";

// Dummy numbers until this is wired to /transactions
const EXPENSE = 1240.5;
const INCOME = 2100;
const EXPENSE_CHANGE = 8.4; // % vs last month
const INCOME_CHANGE = 8.4;

type StatCardProps = {
  label: string;
  value: number;
  change: number;
  trend: "positive" | "negative";
  textColor: string;
};

const StatCard = ({ label, value, change, trend, textColor }: StatCardProps) => {
  const { whole, fraction } = splitAmount(value);
  return (
    <BlurCard style={styles.card}>
      <View style={styles.card_header}>
        <Text style={{ fontSize: 12, opacity: 0.6, color: textColor }}>
          {label}
        </Text>
        <Badge value={change} trend={trend} />
      </View>
      <View style={styles.amount_row}>
        <Text
          style={[styles.amount, { color: textColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {whole}
        </Text>
        <Text style={[styles.fraction, { color: textColor }]}>{fraction}</Text>
      </View>
    </BlurCard>
  );
};

const IncomeExpense = () => {
  const { colors } = useTheme();
  const spentPct = INCOME > 0 ? Math.round((EXPENSE / INCOME) * 100) : 0;
  const left = Math.max(0, INCOME - EXPENSE);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Income & Expenses
        </Text>
        <Text style={{ color: colors.text, opacity: 0.4, fontSize: 12 }}>
          this month
        </Text>
      </View>
      <View style={styles.cards_container}>
        <StatCard
          label="Expenses"
          value={EXPENSE}
          change={EXPENSE_CHANGE}
          trend="negative"
          textColor={colors.text}
        />
        <StatCard
          label="Income"
          value={INCOME}
          change={INCOME_CHANGE}
          trend="positive"
          textColor={colors.text}
        />
      </View>
      <View style={{ gap: 10 }}>
        <ProgressBar
          size={1}
          width={"100%"}
          height={8}
          progress={spentPct}
          trackColor={colors.background}
          fillColor={colors.accent}
        />
        <View style={styles.footer}>
          <Text style={[styles.footer_text, { color: colors.text }]}>
            {spentPct}% of income spent
          </Text>
          <Text style={[styles.footer_text, { color: colors.text }]}>
            {amount(left)} left
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 20,
    width: "100%",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  cards_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    minWidth: 0,
  },
  card_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  amount_row: {
    flexDirection: "row",
    alignItems: "baseline",
    width: "100%",
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
    flexShrink: 1,
  },
  fraction: {
    fontSize: 15,
    fontWeight: "500",
    opacity: 0.45,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer_text: {
    fontSize: 12,
    opacity: 0.64,
  },
});

export default IncomeExpense;
