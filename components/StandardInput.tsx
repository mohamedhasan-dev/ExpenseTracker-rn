import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import useTheme from "@/hooks/useTheme";

interface StandardInputProps extends TextInputProps {
  label: string;
}

const StandardInput: React.FC<StandardInputProps> = ({
  label,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface2,
            borderWidth: 1,
            // instantly change color based on focus state
            borderColor: isFocused ? colors.primary : "transparent",
          },
        ]}
      >
        <TextInput
          {...props}
          // Spread first so the focus handlers below aren't overridden by props
          style={[styles.input, { color: colors.text }, props.style]}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  inputContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default StandardInput;
