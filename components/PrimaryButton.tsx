import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import useTheme from "@/hooks/useTheme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        {
          // Greys out the button if it's disabled, otherwise uses your accent color
          backgroundColor: disabled ? colors.surface2 : colors.accent,
          opacity: pressed && !disabled ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: disabled ? colors.text : "#FFFFFF",
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32, // Gives it solid breathing room from the form above
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

export default PrimaryButton;
