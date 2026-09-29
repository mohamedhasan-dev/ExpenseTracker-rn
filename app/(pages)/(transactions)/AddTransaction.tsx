import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import useTheme from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SegmentedToggle } from "./components/SegmentedToggle";
import { AmountInput } from "./components/AmountInput";

const AddTransaction = () => {
  const { colors } = useTheme();

  //States
  const [transactionType, setTransactionType] = useState<string>("Expense");
  const [amount,setAmount] = useState<number>();
  

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 24 }}>
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
        options={["Expense","Income"]}
        activeOption={transactionType}
        onChange={(selected)=>setTransactionType(selected)}
      />
      <AmountInput onChange={setAmount}/>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
  },
});

export default AddTransaction;
