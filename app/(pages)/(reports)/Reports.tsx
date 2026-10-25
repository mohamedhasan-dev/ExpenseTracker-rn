import { View, Text } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";

const Reports = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.textMuted }}>Reports</Text>
    </View>
  );
};

export default Reports;
