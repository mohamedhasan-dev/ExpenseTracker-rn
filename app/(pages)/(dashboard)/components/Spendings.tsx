import { View, Text, StyleSheet } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import PieChartComponent, { PieChartData } from "@/components/PieChart";
import ProgressBar from "@/components/ProgressBar";
import amount from "../../services/amount";
import type { CategoryTotal } from "@/services/transactions";

const MAX_SLICES = 4; // top 3 categories + "Others"

interface SpendingsProps {
  /** This month's expense totals per category, largest first */
  categories: CategoryTotal[];
  total: number;
}

const Spendings = ({ categories, total }: SpendingsProps) => {
  const { colors } = useTheme();
  const palette = [colors.accent, colors.primary, colors.secondary, colors.surface2];

  // Keep the chart readable: show the biggest categories and fold the rest into "Others"
  const top =
    categories.length > MAX_SLICES
      ? categories.slice(0, MAX_SLICES - 1)
      : categories;
  const othersTotal = categories
    .slice(top.length)
    .reduce((sum, c) => sum + c.total, 0);

  const data: PieChartData[] = [
    ...top.map((c) => ({ label: c.name, value: c.total })),
    ...(othersTotal > 0 ? [{ label: "Others", value: othersTotal }] : []),
  ].map((item, i) => ({ ...item, color: palette[i % palette.length] }));

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Spend by Category
        </Text>
        <Text style={{ color: colors.text, opacity: 0.4, fontSize: 12 }}>
          {categories.length} active
        </Text>
      </View>

      {total <= 0 ? (
        <Text style={[styles.empty, { color: colors.text }]}>
          No expenses this month yet
        </Text>
      ) : (
        <View style={styles.body}>
          <PieChartComponent
            data={data}
            total={total}
            centerValue={amount(total, { compact: true })}
            radius={66}
            thickness={11}
          />
          <View style={styles.legend}>
            {data.map((item) => (
              <View key={item.label} style={{ gap: 6 }}>
                <View style={styles.legend_row}>
                  <Text
                    style={{ color: colors.text, opacity: 0.7, fontSize: 13, flexShrink: 1 }}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: "700",
                    }}
                  >
                    {amount(item.value, { decimals: 0 })}
                  </Text>
                </View>
                <ProgressBar
                  size={1}
                  height={4}
                  width={"100%"}
                  progress={(item.value / total) * 100}
                  trackColor={colors.background}
                  fillColor={item.color}
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 20,
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
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  legend: {
    flex: 1,
    gap: 12,
  },
  legend_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  empty: {
    opacity: 0.55,
    textAlign: "center",
    paddingVertical: 24,
  },
});

export default Spendings;
