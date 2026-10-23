import React from "react";
import { FlatList, Pressable, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import BottomSheet from "./BottomSheet";
import { formatMonth, isSameMonth, startOfMonth } from "@/services/date";

const MONTHS_SHOWN = 24;

interface MonthPickerSheetProps {
  visible: boolean;
  selected: Date;
  onSelect: (month: Date) => void;
  onClose: () => void;
}

/** Pick one of the last 24 months (no future months) */
const MonthPickerSheet = ({ visible, selected, onSelect, onClose }: MonthPickerSheetProps) => {
  const { colors } = useTheme();
  const months = Array.from({ length: MONTHS_SHOWN }, (_, i) =>
    startOfMonth(new Date(), -i),
  );

  return (
    <BottomSheet visible={visible} title="Select month" onClose={onClose}>
      <FlatList
        data={months}
        keyExtractor={(m) => m.toISOString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const active = isSameMonth(item, selected);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(item)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: active ? colors.surface2 : "transparent",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  { color: active ? colors.accent : colors.text },
                ]}
              >
                {formatMonth(item)}
              </Text>
              {active && (
                <MaterialCommunityIcons name="check" size={20} color={colors.accent} />
              )}
            </Pressable>
          );
        }}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  list: {
    maxHeight: 420,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default MonthPickerSheet;
