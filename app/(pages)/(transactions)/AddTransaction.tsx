import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import useTheme from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SegmentedToggle } from "./components/SegmentedToggle";
import { AmountInput } from "./components/AmountInput";
import { CategoryGrid } from "./components/CategoryGrid";

const AddTransaction = () => {
  const { colors } = useTheme();
  type TransactionType = "Expense" | "Income";

  // States
  const [transactionType, setTransactionType] =
    useState<TransactionType>("Expense");
  const [amount, setAmount] = useState<number>();
  const [category, setCategory] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {/* --- STICKY TOP SECTION --- */}
      <View style={styles.header}>
        <Pressable
          style={{
            borderWidth: 0.3,
            borderColor: colors.text,
            borderRadius: 20,
            backgroundColor: "hsl(205, 33%, 20%)",
            padding: 4,
          }}
        >
          <MaterialIcons name="chevron-left" size={24} color={colors.text} />
        </Pressable>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
            }}
          >
            Add Transaction
          </Text>
        </View>
      </View>

      <SegmentedToggle
        options={["Expense", "Income"]}
        activeOption={transactionType}
        onChange={(val) => setTransactionType(val as TransactionType)}
      />

      {/* --- SCROLLABLE BOTTOM SECTION --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <AmountInput
          onChange={setAmount}
          color={transactionType === "Expense" ? colors.accent : colors.primary}
          value={amount?.toString()}
        />
        <CategoryGrid
          transactionType={transactionType}
          selectedCategoryId={category}
          onSelectCategory={setCategory}
        />

        {/* Future elements like Description, Date, and Payment Method will go here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    marginTop: 16, // Adds a little breathing room below the AmountInput horizontal bar
  },
  scrollContent: {
    paddingBottom: 40, // Ensures content doesn't get cut off at the very bottom of the screen
  },
});

export default AddTransaction;
