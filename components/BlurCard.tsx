import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import React from "react";
import useTheme from "@/hooks/useTheme";

interface BlurCardProps {
  children: React.ReactNode;
  style: ViewStyle;
}

const BlurCard = (props: BlurCardProps) => {
  const { isDarkMode } = useTheme();
  return (
    <View
      style={[
        props.style,
        {
          borderWidth: 1,
          overflow: "hidden",
          borderColor: isDarkMode
            ? "hsla(0, 0%, 100%, 0.10)"
            : "hsla(0, 0%, 0%, 0.08)",
          backgroundColor: isDarkMode
            ? "hsla(0, 0%, 100%, 0.05)"
            : "hsla(0, 0%, 0%, 0.03)",
        },
      ]}
    >
      <BlurView
        intensity={20}
        tint={isDarkMode ? "dark" : "light"}
        style={[StyleSheet.absoluteFill]}
      />
      <View style={{ alignItems: "center" }}>{props.children}</View>
    </View>
  );
};

export default BlurCard;
