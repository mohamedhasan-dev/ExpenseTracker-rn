import { View, Text, StyleSheet } from "react-native";
import React from "react";

interface badge {
  value: number; // percentage change, e.g. 8.4
  trend: "positive" | "negative";
}

const Badge = (props: badge) => {
  const color =
    props.trend === "positive" ? "hsl(198, 100%, 59%)" : "hsl(358, 78%, 65%)";
  const sign = props.value > 0 ? "+" : props.value < 0 ? "-" : "";

  return (
    <View
      style={[
        styles.badge,
        props.trend === "positive" ? styles.positive : styles.negative,
      ]}
    >
      <Text style={[styles.text, { color }]}>
        {sign}
        {Math.abs(props.value)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  positive: {
    backgroundColor: "hsl(201, 41%, 32%)",
  },
  negative: {
    backgroundColor: "hsla(358, 43%, 37%, 0.89)",
  },
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
