import { View, Text, StyleSheet } from "react-native";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface badge {
  value: number;
  trend: "positive" | "negative";

}

const Badge = (props: badge) => {
  const color =
    props.trend === "positive"
      ? "hsl(198, 100%, 59%)"
      : "hsl(358, 78%, 65%)";
      const isUp = props.value>0 ? true : false
  return (
    <View
      style={[
        props.trend === "positive" ? styles.positive : styles.negative,
        styles.badge,
      ]}
    >
      <View
        style={{
          paddingRight: 4,
        }}
      >
        <FontAwesome5 name={isUp?"arrow-up":"arrow-down"} size={12} color={color} />
      </View>
      <Text
        style={{
          color: color,
        }}
      >
        {Math.abs(props.value)}
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
    paddingHorizontal: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Badge;
