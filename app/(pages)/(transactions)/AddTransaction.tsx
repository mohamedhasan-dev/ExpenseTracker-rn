import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import useTheme from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SegmentedToggle } from "./components/SegmentedToggle";
import { AmountInput } from "./components/AmountInput";
import { CategoryGrid } from "./components/CategoryGrid";
import { StandardInput } from "@/components/StandardInput";
import { DatePickerRow } from "./components/DatePickerRow";
import { PaymentSelector } from "./components/PaymentSelector";
import { PrimaryButton } from "@/components/PrimaryButton";

const AddTransaction = () => {
  const { colors } = useTheme();
  type TransactionType = "Expense" | "Income";

  // States
  const [transactionType, setTransactionType] =
    useState<TransactionType>("Expense");
  const [amount, setAmount] = useState<number>();
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // Adjust this if you have a top navigation header
    >
      {/* RESTORED INNER WRAPPER WITH PADDING */}
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
          keyboardShouldPersistTaps="handled"
        >
          <AmountInput
            onChange={setAmount}
            value={amount?.toString()}
            color={
              transactionType === "Expense" ? colors.accent : colors.primary
            }
          />
          <CategoryGrid
            transactionType={transactionType}
            selectedCategoryId={category}
            onSelectCategory={setCategory}
          />
          <StandardInput
            label="Description"
            placeholder="e.g. Lunch at restaurant"
            value={description}
            onChangeText={setDescription}
          />
          <DatePickerRow date={date} onChange={setDate} />

          <PaymentSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
          <PrimaryButton
            label={`Add ${transactionType}`} // Dynamically says "Add Expense" or "Add Income"
            disabled={!amount || !category} // Requires an amount and category to be selected
            onPress={() => {
              // This payload is ready to be sent to your Drizzle/Neon database!
              const transactionPayload = {
                type: transactionType,
                amount: amount,
                categoryId: category,
                description: description.trim(),
                date: date.toISOString(),
                paymentMethod: paymentMethod,
              };

              console.log("Ready to save:", transactionPayload);

              // TODO: Add database save function and navigation.goBack() here
            }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});

export default AddTransaction;
