import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "@/hooks/useTheme";
import { SelectableCard } from "@/components/SelectableCard";

export type PaymentMethod = "UPI" | "Card" | "Cash" | "Bank";

// Removed icons from the array
const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "Cash", label: "Cash" },
  { id: "UPI", label: "UPI" },
  { id: "Card", label: "Card" },
  { id: "Bank", label: "Bank" },
];

interface PaymentSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        PAYMENT METHOD
      </Text>

      <View style={styles.row}>
        {PAYMENT_METHODS.map((method) => (
          <SelectableCard
            key={method.id}
            label={method.label}
            isActive={selectedMethod === method.id}
            onPress={() => onSelect(method.id)}
            flex={1}
            height={54} // Reduced height for text-only layout
            labelSize={14} // Optional label size
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    opacity: 0.5,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
});
