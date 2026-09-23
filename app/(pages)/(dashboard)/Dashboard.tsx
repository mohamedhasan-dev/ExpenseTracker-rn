import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import useTheme from "@/hooks/useTheme";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import IncomeExpense from "./components/IncomeExpense";
import Spendings from "./components/Spendings";
import Recent_Transactions, {
  transaction,
} from "./components/Recent_Transactions";
import { API_URL } from "@/services/api";

// Dummy data until this is wired to GET /transactions
const transactions: transaction[] = [
  {
    amount: 42.5,
    description: "Whole Foods Market",
    type: "expense",
    category: "food",
    date: "Today, 2:40 PM",
  },
  {
    amount: 18.2,
    description: "Uber Trip",
    type: "expense",
    category: "transport",
    date: "Yesterday",
  },
  {
    amount: 129,
    description: "Apple Store",
    type: "expense",
    category: "shopping",
    date: "14 Oct",
  },
  {
    amount: 85,
    description: "Metropolitan Power",
    type: "expense",
    category: "bills",
    date: "12 Oct",
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const fetchAPI = useFetch();
  const { colors } = useTheme();
  const [user, setUser] = useState("");
  const month = new Date()
    .toLocaleString("en-US", { month: "long" }) //Make it Reactive
    .toUpperCase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchAPI(`${API_URL}/users`, "GET");
        if (!response.ok) return;
        const data: { user_name?: string } = await response.json();
        if (typeof data?.user_name === "string") setUser(data.user_name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [fetchAPI]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.month, { color: colors.text }]}>{month}</Text>
      <View style={styles.header}>
        <Text
          style={[styles.greetings, { color: colors.text }]}
          numberOfLines={1}
        >
          {getGreeting()}
          {user ? `, ${user}` : ""}
        </Text>
        <View
          style={[
            styles.avatar,
            { borderColor: colors.accent, backgroundColor: colors.surface },
          ]}
        >
          {user ? (
            <Text style={[styles.avatar_text, { color: colors.accent }]}>
              {user.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <FontAwesome name="user" size={18} color={colors.accent} />
          )}
        </View>
      </View>
      <View style={styles.content}>
        <IncomeExpense />
        <Spendings />
        <Recent_Transactions transactions={transactions} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  content: {
    gap: 16,
  },
  month: {
    opacity: 0.55,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  greetings: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar_text: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Dashboard;
