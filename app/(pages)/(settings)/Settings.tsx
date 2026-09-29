import { View, Text } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";

const Settings = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.text, opacity: 0.6 }}>Settings</Text>
    </View>
  );
};

export default Settings;
