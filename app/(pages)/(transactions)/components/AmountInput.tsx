import useTheme from "@/hooks/useTheme";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface AmountInputProps {
  onChange: (amount: number) => void;
  initialValue?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  onChange,
  initialValue = "",
}) => {
  const [rawValue, setRawValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();
  // 1. Custom Blinking Cursor Animation
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 450 }),
        withTiming(1, { duration: 450 }),
      ),
      -1, // Infinite loop
      true, // Reverse direction
    );
  }, []);

  const animatedCursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  const handleTextChange = (text: string) => {
    let cleanText = text.replace(/[^0-9.]/g, "");

    const parts = cleanText.split(".");
    if (parts.length > 2) {
      cleanText = parts[0] + "." + parts.slice(1).join("");
    }
    if (parts.length === 2 && parts[1].length > 2) {
      cleanText = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    setRawValue(cleanText);

    const parsed = parseFloat(cleanText);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  // 2. Splitting and formatting the integer and decimal parts
  const parts = rawValue.split(".");
  const integerPart = parts[0]
    ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "0";
  const hasDecimal = rawValue.includes(".");
  const decimalPart = hasDecimal ? parts[1] : "";

  // 3. Fallback for completely empty state
  const isEmpty = rawValue === "";
  const displayInteger = isEmpty ? "0" : integerPart;
  const displayDecimal = isEmpty ? ".00" : hasDecimal ? `.${decimalPart}` : "";

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>AMOUNT</Text>

      {/* 4. Perfectly Centered Input Wrapper */}
      <View style={styles.inputContainer}>
        {/* Visual Layer */}
        <View style={styles.displayRow}>
          <Text style={[styles.currencySymbol, { color: colors.accent }]}>
            ₹
          </Text>

          {/* Conditionally mute the integer '0' if there is no input */}
          <Text
            style={[
              styles.integerText,
              { color: isEmpty ? colors.surface2 : colors.text },
            ]}
          >
            {displayInteger}
          </Text>

          <Text style={[styles.decimalText, { color: colors.surface2 }]}>
            {displayDecimal}
          </Text>

          {isFocused && (
            <Animated.View
              style={[
                styles.cursor,
                animatedCursorStyle,
                {
                  backgroundColor: colors.accent,
                  shadowColor: colors.accent,
                },
              ]}
            />
          )}
        </View>

        {/* Hidden Interaction Layer */}
        <TextInput
          style={styles.hiddenInput}
          value={rawValue}
          onChangeText={handleTextChange}
          keyboardType="decimal-pad"
          caretHidden={true} // Hides the oversized native cursor
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={12}
        />
      </View>

      {/* 5. The Horizontal Gradient/Glow Bar */}
      <LinearGradient
        colors={["transparent", colors.accent, "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.horizontalBar,
          {
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 6,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 32,
  },
  label: {
    opacity: 0.5,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "flex-end", // Ensures the baselines of the different font sizes match up
    justifyContent: "center",
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
    marginRight: 6,
  },
  integerText: {
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: 1,
  },
  decimalText: {
    fontSize: 32, // Smaller, muted decimals
    fontWeight: "600",
    marginBottom: 6, // Slight offset to align visually with the large integer baseline
  },
  cursor: {
    width: 3,
    height: 48, // Properly proportioned cursor height
    marginLeft: 4,
    marginBottom: 4,
    borderRadius: 2,
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0, // Completely invisible to the user
    color: "transparent",
  },
  horizontalBar: {
    marginTop: 16,
    height: 2,
    width: 140,
    borderRadius: 2,
  },
});
