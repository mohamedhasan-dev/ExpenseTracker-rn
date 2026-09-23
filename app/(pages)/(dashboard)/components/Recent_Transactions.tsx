import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import amount from "../../services/amount";
import { ColorsType } from "@/themes/colors";

export type transaction = {
  id?: string;
  amount: number;
  description: string;
  type: string; // "expense" | "income"
  date: string;
  category?: string;
};

interface RecentTransactionsProps {
  transactions: transaction[];
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const CATEGORY_ICONS: Record<
  string,
  { icon: IconName; color: keyof ColorsType }
> = {
  food: { icon: "circle", color: "accent" },
  transport: { icon: "rhombus", color: "primary" },
  shopping: { icon: "triangle", color: "accent" },
  bills: { icon: "square", color: "text" },
};

const getIconMeta = (t: transaction, colors: ColorsType) => {
  const isIncome = t.type.toLowerCase() === "income";
  const match = t.category
    ? CATEGORY_ICONS[t.category.toLowerCase()]
    : undefined;
  const name: IconName = match
    ? match.icon
    : isIncome
      ? "arrow-up"
      : "arrow-down";
  const color = match
    ? colors[match.color]
    : isIncome
      ? colors.primary
      : colors.accent;
  return { isIncome, name, color };
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Recent_Transactions = ({ transactions }: RecentTransactionsProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Recent</Text>
        <Pressable hitSlop={8}>
          <Text style={[styles.see_all, { color: colors.accent }]}>
            See all
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {transactions.length === 0 && (
          <Text style={[styles.empty, { color: colors.text }]}>
            No transactions yet
          </Text>
        )}
        {transactions.map((t, index) => {
          const meta = getIconMeta(t, colors);
          return (
            <View key={t.id ?? index} style={styles.row}>
              <View
                style={[styles.icon, { backgroundColor: colors.background }]}
              >
                <MaterialCommunityIcons
                  name={meta.name}
                  size={14}
                  color={meta.color}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={[styles.description, { color: colors.text }]}
                >
                  {t.description}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.meta, { color: colors.text }]}
                >
                  {capitalize(t.category ?? t.type)} · {t.date}
                </Text>
              </View>

              <Text style={[styles.amount, { color: colors.text }]}>
                {meta.isIncome ? "+" : "-"}
                {amount(Math.abs(Number(t.amount)))}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  see_all: {
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    opacity: 0.55,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
  empty: {
    opacity: 0.55,
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default Recent_Transactions;
