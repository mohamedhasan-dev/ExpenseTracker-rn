import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from "react-native";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback, useState } from "react";
import useTheme from "@/hooks/useTheme";
import SegmentedToggle from "./components/SegmentedToggle";
import AmountInput, { parseAmount } from "./components/AmountInput";
import CategoryGrid from "./components/CategoryGrid";
import StandardInput from "@/components/StandardInput";
import DatePickerRow from "./components/DatePickerRow";
import PaymentSelector from "./components/PaymentSelector";
import PrimaryButton from "@/components/PrimaryButton";
import BackButton from "@/components/BackButton";
import {
  errorMessage,
  useCreateTransaction,
  type PaymentMethod,
  type TransactionType,
} from "@/services/queries";

const TYPES = ["Expense", "Income"] as const;

const AddTransaction = () => {
  const { colors } = useTheme();
  const createTransaction = useCreateTransaction();
  const navigation = useNavigation();
  // "list" = opened from the Transactions list's button; otherwise from the navbar's +
  const { from } = useLocalSearchParams<{ from?: string }>();

  /** Return to wherever Add Transaction was opened from */
  const close = useCallback(() => {
    if (from === "list" && navigation.canGoBack()) {
      navigation.goBack(); // back to the Transactions list underneath
      return;
    }
    // Opened with the navbar's +: go back to the previous tab (Home, Budget, ...).
    // The tab's stack then resets to the list (popToTopOnBlur in (pages)/_layout).
    const tabs = navigation.getParent();
    if (tabs?.canGoBack()) tabs.goBack();
    else router.navigate("/Dashboard");
  }, [from, navigation]);

  // Android back gesture/button behaves exactly like the on-screen back button
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        close();
        return true;
      });
      return () => sub.remove();
    }, [close]),
  );

  // Form state
  const [transactionType, setTransactionType] =
    useState<TransactionType>("Expense");
  const [amountText, setAmountText] = useState(""); // raw text, see AmountInput
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  const amount = parseAmount(amountText);
  const isSaving = createTransaction.isPending;
  const canSave = amount > 0 && category !== null && !isSaving;

  const changeType = (type: TransactionType) => {
    setTransactionType(type);
    // Expense and income have different categories, so the old pick is no longer valid
    setCategory(null);
    createTransaction.reset();
  };

  const resetForm = () => {
    setTransactionType("Expense");
    setAmountText("");
    setCategory(null);
    setDescription("");
    setDate(new Date());
    setPaymentMethod("UPI");
  };

  const handleSave = () => {
    if (!canSave || category === null) return;
    createTransaction.mutate(
      {
        type: transactionType,
        amount,
        categoryId: category,
        description: description.trim() || undefined,
        date: date.toISOString(),
        paymentMethod,
      },
      {
        onSuccess: () => {
          resetForm();
          close();
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <View style={{ flex: 1, padding: 24 }}>
        {/* --- STICKY TOP SECTION --- */}
        <View style={styles.header}>
          <BackButton onPress={close} />
          <Text style={[styles.title, { color: colors.text }]}>
            Add Transaction
          </Text>
          {/* Same width as the back button so the title stays centred */}
          <View style={styles.headerSpacer} />
        </View>

        <SegmentedToggle
          options={TYPES}
          activeOption={transactionType}
          onChange={changeType}
        />

        {/* --- SCROLLABLE BOTTOM SECTION --- */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <AmountInput
            value={amountText}
            onChange={setAmountText}
            color={
              transactionType === "Expense" ? colors.expense : colors.primary
            }
          />
          <CategoryGrid
            transactionType={transactionType}
            selectedCategoryId={category}
            onSelectCategory={setCategory}
          />
          <StandardInput
            label="Description"
            placeholder={
              transactionType === "Income"
                ? "e.g. October salary"
                : "e.g. Lunch at restaurant"
            }
            value={description}
            onChangeText={setDescription}
            maxLength={255}
          />
          <DatePickerRow date={date} onChange={setDate} />

          <PaymentSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />

          {createTransaction.isError && (
            <Text style={[styles.error, { color: colors.warning }]}>
              {errorMessage(
                createTransaction.error,
                "Couldn't save the transaction. Please try again.",
              )}
            </Text>
          )}

          <PrimaryButton
            label={isSaving ? "Saving..." : `Add ${transactionType}`}
            disabled={!canSave} // Needs an amount and a category
            onPress={handleSave}
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
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
  },
  headerSpacer: {
    width: 34,
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  error: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
});

export default AddTransaction;
