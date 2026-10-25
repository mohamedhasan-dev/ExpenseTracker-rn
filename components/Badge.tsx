import { View, Text, StyleSheet } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";

interface BadgeProps {
  /** % change vs the previous period (e.g. 8.4). null = no baseline -> renders nothing */
  change: number | null;
  /** false for metrics where going up is bad (expenses). Default true. */
  higherIsBetter?: boolean;
  /** Used for the screen-reader label, e.g. "Up 8.4% from last month" */
  periodLabel?: string;
}

/** "+8.4%", "-12%", "+150%", "+999+%" style label */
const formatChange = (change: number) => {
  const abs = Math.abs(change);
  const digits =
    abs >= 1000
      ? "999+"
      : abs >= 100
        ? Math.round(abs).toString()
        : abs.toFixed(1).replace(/\.0$/, "");
  const sign = change > 0 ? "+" : change < 0 ? "-" : "";
  return `${sign}${digits}%`;
};

/** Month-over-month change pill. Picks its own colour from the direction. */
const Badge = ({ change, higherIsBetter = true, periodLabel = "last month" }: BadgeProps) => {
  const { colors } = useTheme();

  if (change === null || !Number.isFinite(change)) return null;

  const tone =
    change === 0
      ? { background: colors.surface2, text: colors.text }
      : change > 0 === higherIsBetter
        ? { background: colors.incomeSoft, text: colors.primary }
        : { background: colors.expenseSoft, text: colors.expense };
  const label = formatChange(change);
  const spoken =
    change === 0
      ? `No change from ${periodLabel}`
      : `${change > 0 ? "Up" : "Down"} ${Math.abs(change)}% from ${periodLabel}`;

  return (
    <View
      accessible
      accessibilityLabel={spoken}
      style={[styles.badge, { backgroundColor: tone.background }]}
    >
      <Text style={[styles.text, { color: tone.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default Badge;
