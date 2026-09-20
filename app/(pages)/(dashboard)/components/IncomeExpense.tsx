import { View, Text, StyleSheet } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import BlurCard from "@/components/BlurCard";
import Badge from "@/components/Badge";
import amount from "../../services/amount";
import ProgressBar from "@/components/ProgressBar";

const IncomeExpense = () => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={{
            color: colors.text,
          }}
        >
          Income & Expense
        </Text>
        <Text
          style={{
            color: colors.text,
            opacity: 0.4,
            fontWeight: "thin",
          }}
        >
          this month
        </Text>
      </View>
      <View style={styles.cards_container}>
        <BlurCard style={styles.card}>
          <View style={styles.card_header}>
            <Text
              style={{
                fontSize: 12,
                opacity: 0.6,
                color: colors.text,
              }}
            >
              Expenses
            </Text>
            <Badge value={20} trend="negative" />
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily: "monospace",
                color: colors.text,
                fontWeight: "900",
                textAlign: "left",
                letterSpacing: 0.8,
              }}
            >
              {amount(100)}
            </Text>
          </View>
        </BlurCard>
        <BlurCard style={styles.card}>
          <View style={styles.card_header}>
            <Text
              style={{
                fontSize: 12,
                opacity: 0.6,
                color: colors.text,
              }}
            >
              Income
            </Text>
            <Badge value={10} trend="positive" />
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily: "monospace",
                color: colors.text,
                fontWeight: "900",
                textAlign: "left",
                letterSpacing: 0.8,
              }}
            >
              {amount(25)}
            </Text>
          </View>
        </BlurCard>
      </View>
      <View
        style={{
          gap: 12,
        }}
      >
        <View>
          <ProgressBar
            size={1}
            width={"100%"}
            height={10}
            progress={70}
            trackColor={colors.background}
            fillColor={colors.accent}
          />
        </View>
        <View style={{
          flexDirection:'row',
          justifyContent:'space-between'
        }}>
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
              opacity: 0.7,
            }}
          >
            {"50%"} of income spent
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
              opacity: 0.7,
            }}
          >
            {amount(799)} left
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cards_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    padding: 14,
    width: 163,
    borderRadius: 20,
  },
});

export default IncomeExpense;
