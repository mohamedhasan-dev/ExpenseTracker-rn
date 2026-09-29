import { View, Text } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";

const Budget = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.text, opacity: 0.6 }}>Budget</Text>
    </View>
  );
};

export default Budget;
