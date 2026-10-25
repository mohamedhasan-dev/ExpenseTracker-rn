import useTheme from "@/hooks/useTheme";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

// Server limit is 99,999,999.99 -> at most 8 digits before the decimal point
const MAX_INTEGER_DIGITS = 8;

/** Numeric value of the raw text, 0 when empty */
export const parseAmount = (raw: string) => {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
};

/** Keeps digits and one ".", max 2 decimals and 8 integer digits */
const sanitize = (text: string) => {
  const clean = text.replace(/[^0-9.]/g, "");
  const [rawInt = "", ...rest] = clean.split(".");
  const hasDecimal = rest.length > 0;
  let integer = rawInt.replace(/^0+(?=\d)/, "").slice(0, MAX_INTEGER_DIGITS);
  if (integer === "" && hasDecimal) integer = "0";
  return hasDecimal ? `${integer}.${rest.join("").slice(0, 2)}` : integer;
};

interface AmountInputProps {
  /** Raw text, e.g. "1240.5" (kept as text so "12." survives while typing) */
  value: string;
  onChange: (raw: string) => void;
  color?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({ onChange, value, color }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();
  const tint = color ?? colors.expense;

  // 1. Custom blinking cursor, only animated while the field is focused
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      cursorOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 450 }),
          withTiming(1, { duration: 450 }),
        ),
        -1, // Infinite loop
        true, // Reverse direction
      );
    } else {
      cancelAnimation(cursorOpacity);
      cursorOpacity.value = 1;
    }
  }, [isFocused, cursorOpacity]);

  const animatedCursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  // 2. Splitting and formatting the integer and decimal parts (Indian grouping)
  const [integerRaw = "", decimalRaw] = value.split(".");
  const isEmpty = value === "";
  const displayInteger = integerRaw
    ? Number(integerRaw).toLocaleString("en-IN")
    : "0";
  const displayDecimal = isEmpty
    ? ".00"
    : decimalRaw !== undefined
      ? `.${decimalRaw}`
      : "";

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>AMOUNT</Text>

      {/* 3. Centered input wrapper */}
      <View style={styles.inputContainer}>
        {/* Visual Layer */}
        <View style={styles.displayRow}>
          <Text style={[styles.currencySymbol, { color: tint }]}>₹</Text>

          {/* Mute the integer '0' if there is no input */}
          <Text
            style={[
              styles.integerText,
              { color: isEmpty ? colors.textMuted : colors.text },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayInteger}
          </Text>

          <Text style={[styles.decimalText, { color: colors.textMuted }]}>
            {displayDecimal}
          </Text>

          {isFocused && (
            <Animated.View
              style={[
                styles.cursor,
                animatedCursorStyle,
                { backgroundColor: tint, shadowColor: tint },
              ]}
            />
          )}
        </View>

        {/* Hidden Interaction Layer */}
        <TextInput
          accessibilityLabel="Amount"
          style={styles.hiddenInput}
          value={value}
          onChangeText={(text) => onChange(sanitize(text))}
          keyboardType="decimal-pad"
          caretHidden={true} // Hides the oversized native cursor
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={MAX_INTEGER_DIGITS + 3}
        />
      </View>

      {/* 4. The Horizontal Gradient/Glow Bar */}
      <LinearGradient
        colors={["transparent", tint, "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.horizontalBar,
          {
            shadowColor: tint,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
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
    paddingHorizontal: 16,
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
    flexShrink: 1,
  },
  decimalText: {
    fontSize: 32, // Smaller, muted decimals
    fontWeight: "600",
    marginBottom: 6, // Slight offset to align visually with the large integer baseline
  },
  cursor: {
    width: 3,
    height: 48,
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

export default AmountInput;
