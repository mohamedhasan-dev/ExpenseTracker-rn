import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import BottomSheet from "./BottomSheet";
import DatePickerRow from "./DatePickerRow";
import {
  errorMessage,
  useCategories,
  type Category,
  type PaymentMethod,
} from "@/services/queries";
import { startOfDay } from "@/services/date";
import type { TransactionTypeFilter } from "@/services/transactions";

export type DatePreset = "month" | "today" | "week" | "custom";

/** Filters set in the sheet (the type tabs and search live on the screen) */
export type AdvancedFilters = {
  datePreset: DatePreset;
  customFrom: Date;
  customTo: Date;
  categoryIds: string[];
  paymentMethods: PaymentMethod[];
};

export const defaultFilters = (): AdvancedFilters => ({
  datePreset: "month",
  customFrom: startOfDay(new Date()),
  customTo: startOfDay(new Date()),
  categoryIds: [],
  paymentMethods: [],
});

/** How many filter groups differ from the defaults (shown on the Filter button) */
export const countActiveFilters = (f: AdvancedFilters) =>
  (f.datePreset !== "month" ? 1 : 0) +
  (f.categoryIds.length > 0 ? 1 : 0) +
  (f.paymentMethods.length > 0 ? 1 : 0);

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "UPI", "Card", "Bank"];

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
const toIcon = (name: string): IconName =>
  name in MaterialCommunityIcons.glyphMap ? (name as IconName) : "shape-outline";

const Chip = ({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon?: IconName;
  active: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  // Selected = crimson border + soft tint, same as SelectableCard on the Add Transaction screen
  const tint = active ? colors.accentText : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.accentSoft : colors.surface2,
          borderColor: active ? colors.accent : "transparent",
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon && <MaterialCommunityIcons name={icon} size={16} color={tint} />}
      <Text style={[styles.chipText, { color: tint }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};

const SectionTitle = ({ children }: { children: string }) => {
  const { colors } = useTheme();
  return <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{children}</Text>;
};

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

interface FilterSheetProps {
  visible: boolean;
  filters: AdvancedFilters;
  /** Current type tab: limits which categories are offered */
  typeTab: TransactionTypeFilter;
  /** Label for the "month" preset, e.g. "This month" or "September 2026" */
  monthLabel: string;
  onApply: (filters: AdvancedFilters) => void;
  onClose: () => void;
}

const FilterSheet = ({
  visible,
  filters,
  typeTab,
  monthLabel,
  onApply,
  onClose,
}: FilterSheetProps) => {
  const { colors } = useTheme();
  // Edits stay in a draft until "Apply filters"
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  const categoriesQuery = useCategories(typeTab === "All" ? undefined : typeTab);
  const categories = categoriesQuery.data ?? [];
  // "Other" exists for both types; label duplicates with their type when both are shown
  const nameCount = new Map<string, number>();
  categories.forEach((c) => nameCount.set(c.name, (nameCount.get(c.name) ?? 0) + 1));
  const categoryLabel = (c: Category) =>
    (nameCount.get(c.name) ?? 0) > 1 ? `${c.name} · ${c.type}` : c.name;

  const presets: { id: DatePreset; label: string }[] = [
    { id: "month", label: monthLabel },
    { id: "today", label: "Today" },
    { id: "week", label: "This week" },
    { id: "custom", label: "Custom" },
  ];

  const footer = (
    <View style={styles.footer}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setDraft(defaultFilters())}
        style={({ pressed }) => [
          styles.footerButton,
          { borderColor: colors.surface2, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={[styles.footerText, { color: colors.text }]}>Reset</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => onApply(draft)}
        style={({ pressed }) => [
          styles.footerButton,
          styles.applyButton,
          { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={[styles.footerText, { color: colors.onAccent }]}>Apply filters</Text>
      </Pressable>
    </View>
  );

  return (
    <BottomSheet visible={visible} title="Filters" onClose={onClose} footer={footer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <SectionTitle>DATE RANGE</SectionTitle>
        <View style={styles.chips}>
          {presets.map((p) => (
            <Chip
              key={p.id}
              label={p.label}
              active={draft.datePreset === p.id}
              onPress={() => setDraft((d) => ({ ...d, datePreset: p.id }))}
            />
          ))}
        </View>
        {draft.datePreset === "custom" && (
          <View style={styles.customRange}>
            <View style={{ flex: 1 }}>
              <DatePickerRow
                label="From"
                date={draft.customFrom}
                onChange={(d) =>
                  setDraft((prev) => ({
                    ...prev,
                    customFrom: startOfDay(d),
                    // keep the range valid
                    customTo: prev.customTo < startOfDay(d) ? startOfDay(d) : prev.customTo,
                  }))
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <DatePickerRow
                label="To"
                date={draft.customTo}
                minimumDate={draft.customFrom}
                onChange={(d) => setDraft((prev) => ({ ...prev, customTo: startOfDay(d) }))}
              />
            </View>
          </View>
        )}

        <SectionTitle>CATEGORY</SectionTitle>
        {categories.length > 0 ? (
          <View style={styles.chips}>
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={categoryLabel(c)}
                icon={toIcon(c.icon)}
                active={draft.categoryIds.includes(c.id)}
                onPress={() =>
                  setDraft((d) => ({ ...d, categoryIds: toggle(d.categoryIds, c.id) }))
                }
              />
            ))}
          </View>
        ) : categoriesQuery.isPending ? (
          <ActivityIndicator style={styles.status} color={colors.primary} />
        ) : (
          <Pressable style={styles.status} onPress={() => categoriesQuery.refetch()}>
            <Text style={[styles.statusText, { color: colors.textMuted }]}>
              {categoriesQuery.isError
                ? `${errorMessage(categoriesQuery.error, "Couldn't load categories.")} Tap to retry.`
                : "No categories yet"}
            </Text>
          </Pressable>
        )}

        <SectionTitle>PAYMENT METHOD</SectionTitle>
        <View style={styles.chips}>
          {PAYMENT_METHODS.map((m) => (
            <Chip
              key={m}
              label={m}
              active={draft.paymentMethods.includes(m)}
              onPress={() =>
                setDraft((d) => ({ ...d, paymentMethods: toggle(d.paymentMethods, m) }))
              }
            />
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 18,
    marginBottom: 10,
    marginLeft: 2,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: "100%",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  customRange: {
    flexDirection: "row",
    gap: 12,
    marginTop: -12, // SelectorRow brings its own top margin
  },
  status: {
    paddingVertical: 12,
  },
  statusText: {
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
  },
  footerButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButton: {
    flex: 2,
    borderWidth: 0,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default FilterSheet;
