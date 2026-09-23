import { View, Text, StyleSheet } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import PieChartComponent, { PieChartData } from "@/components/PieChart";
import ProgressBar from "@/components/ProgressBar";
import amount from "../../services/amount";

const Spendings = () => {
  const { colors } = useTheme();
  // Dummy data until categories come from /transactions
  const data: PieChartData[] = [
    { value: 450, color: colors.accent, label: "Food" },
    { value: 320, color: colors.primary, label: "Shopping" },
    { value: 290, color: colors.secondary, label: "Bills" },
    { value: 180, color: colors.surface2, label: "Transport" },
  ];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Spend by Category
        </Text>
        <Text style={{ color: colors.text, opacity: 0.4, fontSize: 12 }}>
          {data.length} active
        </Text>
      </View>
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
                  style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}
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
                progress={total > 0 ? (item.value / total) * 100 : 0}
                trackColor={colors.background}
                fillColor={item.color}
              />
            </View>
          ))}
        </View>
      </View>
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
});

export default Spendings;
