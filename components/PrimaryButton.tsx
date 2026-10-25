import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import useTheme from "@/hooks/useTheme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** "filled" = crimson main action; "outline" = quieter/destructive (e.g. Log out) */
  variant?: "filled" | "outline";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = "filled",
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        {
          // Greyed out when disabled; crimson fill, or a blossom-red outline
          backgroundColor: disabled
            ? colors.surface2
            : variant === "outline"
              ? "transparent"
              : colors.accent,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: colors.expense,
          opacity: pressed && !disabled ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: disabled
              ? colors.textMuted
              : variant === "outline"
                ? colors.expense
                : colors.onAccent,
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
