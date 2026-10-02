import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SelectableCard } from "./SelectableCard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";

// Using types to ensure strict mapping with MaterialCommunityIcons
export type CategoryItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: "e1", label: "Food", icon: "silverware-fork-knife" },
  { id: "e2", label: "Transport", icon: "bus" },
  { id: "e3", label: "Shopping", icon: "shopping-outline" },
  { id: "e4", label: "Bills", icon: "receipt-text-outline" },
  { id: "e5", label: "Entertainment", icon: "television-classic" },
  { id: "e6", label: "Health", icon: "hospital-box-outline" },
  { id: "e7", label: "Groceries", icon: "cart-outline" },
  { id: "e8", label: "Education", icon: "school-outline" },
  { id: "e9", label: "Tech", icon: "cpu-64-bit" },
  { id: "e10", label: "Hobbies", icon: "fishbowl-outline" },
  { id: "e11", label: "Other", icon: "dots-horizontal-circle-outline" },
];

const INCOME_CATEGORIES: CategoryItem[] = [
  { id: "i1", label: "Allowance", icon: "wallet-outline" },
  { id: "i2", label: "Salary", icon: "bank-outline" },
  { id: "i3", label: "Freelance", icon: "code-tags" },
  { id: "i4", label: "Gifts", icon: "gift-outline" },
  { id: "i5", label: "Refunds", icon: "cash-refund" },
  { id: "i6", label: "Other", icon: "dots-horizontal-circle-outline" },
];

interface CategoryGridProps {
  transactionType: "Expense" | "Income";
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  transactionType,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  // Swap the list automatically when the SegmentedToggle changes
  const activeCategories =
    transactionType === "Expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        CATEGORY
      </Text>

      <View style={styles.grid}>
        {activeCategories.map((category) => (
          <SelectableCard
            key={category.id}
            label={category.label}
            icon={category.icon}
            isActive={selectedCategoryId === category.id}
            onPress={() => onSelectCategory(category.id)}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Pushes the 31% width cards nicely across the row
  },
});
