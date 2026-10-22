import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import SelectableCard from "@/components/SelectableCard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import { errorMessage, useCategories } from "@/services/queries";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Icons come from the API; fall back if the name isn't a valid glyph
const toIcon = (name: string): IconName =>
  name in MaterialCommunityIcons.glyphMap
    ? (name as IconName)
    : "shape-outline";

interface CategoryGridProps {
  transactionType: "Expense" | "Income";
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  transactionType,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  // Cached categories for the selected type (instant from cache, refreshed in background)
  const {
    data: activeCategories,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCategories(transactionType);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        CATEGORY
      </Text>

      {activeCategories && activeCategories.length > 0 ? (
        <View style={styles.grid}>
          {activeCategories.map((category) => (
            <SelectableCard
              key={category.id}
              label={category.name}
              icon={toIcon(category.icon)}
              isActive={selectedCategoryId === category.id}
              onPress={() => onSelectCategory(category.id)}
            />
          ))}
        </View>
      ) : isPending ? (
        // First launch only: nothing cached yet
        <View style={styles.status}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError ? (
        <Pressable
          style={styles.status}
          onPress={() => refetch()}
          disabled={isRefetching}
        >
          {isRefetching ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <Text style={{ color: colors.text, opacity: 0.6, textAlign: "center" }}>
              {errorMessage(error, "Couldn't load categories.")} Tap to retry.
            </Text>
          )}
        </Pressable>
      ) : (
        <View style={styles.status}>
          <Text style={{ color: colors.text, opacity: 0.6 }}>
            No categories yet
          </Text>
        </View>
      )}
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
    gap: 12,
  },
  status: {
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CategoryGrid;
