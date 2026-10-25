import { View, Text, StyleSheet } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import BlurCard from "@/components/BlurCard";
import Badge from "@/components/Badge";
import amount, { splitAmount } from "../../services/amount";
import ProgressBar from "@/components/ProgressBar";

type StatCardProps = {
  label: string;
  value: number;
  /** % vs last month; null hides the badge (nothing to compare with) */
  change: number | null;
  /** true for income (going up is good), false for expenses */
  upIsGood: boolean;
  /** What the % is compared with, for screen readers */
  periodLabel?: string;
  textColor: string;
};

const StatCard = ({
  label,
  value,
  change,
  upIsGood,
  periodLabel,
  textColor,
}: StatCardProps) => {
  const { colors } = useTheme();
  const { whole, fraction } = splitAmount(value);
  return (
    <BlurCard style={styles.card}>
      <View style={styles.card_header}>
        <Text style={{ fontSize: 12, color: colors.textMuted }}>
          {label}
        </Text>
        <Badge
          change={change}
          higherIsBetter={upIsGood}
          periodLabel={periodLabel}
        />
      </View>
      <View style={styles.amount_row}>
        <Text
          style={[styles.amount, { color: textColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {whole}
        </Text>
        <Text style={[styles.fraction, { color: colors.textMuted }]}>{fraction}</Text>
      </View>
    </BlurCard>
  );
};

interface IncomeExpenseProps {
  income: number;
  expense: number;
  incomeChange: number | null;
  expenseChange: number | null;
  /** e.g. "the same period last month" (month-to-date) or "last month" */
  periodLabel?: string;
}

const IncomeExpense = ({
  income,
  expense,
  incomeChange,
  expenseChange,
  periodLabel,
}: IncomeExpenseProps) => {
  const { colors } = useTheme();
  const spentPct = income > 0 ? Math.round((expense / income) * 100) : 0;
  const left = income - expense;

  const summary =
    income > 0
      ? `${spentPct}% of income spent`
      : expense > 0
        ? "No income this month"
        : "Nothing spent yet";

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Income & Expenses
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          this month
        </Text>
      </View>
      <View style={styles.cards_container}>
        <StatCard
          label="Expenses"
          value={expense}
          change={expenseChange}
          upIsGood={false}
          periodLabel={periodLabel}
          textColor={colors.text}
        />
        <StatCard
          label="Income"
          value={income}
          change={incomeChange}
          upIsGood
          periodLabel={periodLabel}
          textColor={colors.text}
        />
      </View>
      <View style={{ gap: 10 }}>
        <ProgressBar
          size={1}
          width={"100%"}
          height={8}
          progress={income > 0 ? spentPct : expense > 0 ? 100 : 0}
          trackColor={colors.background}
          fillColor={colors.accent}
        />
        <View style={styles.footer}>
          <Text style={[styles.footer_text, { color: colors.textMuted }]}>
            {summary}
          </Text>
          <Text
            style={[
              styles.footer_text,
              { color: left < 0 ? colors.expense : colors.textMuted },
            ]}
          >
            {left < 0 ? `${amount(-left)} over` : `${amount(left)} left`}
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
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer_text: {
    fontSize: 12,
  },
});

export default IncomeExpense;
