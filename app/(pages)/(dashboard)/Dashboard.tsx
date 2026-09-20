import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import useTheme from "@/hooks/useTheme";
import { StyleSheet, Text, View } from "react-native";
import IncomeExpense from "./components/IncomeExpense";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const fetchAPI = useFetch();
  const month = new Date().toLocaleString("en-US", {
    //Make it Reactive
    month: "long",
  });

  const { colors } = useTheme();
  const [user, setUser] = useState("Hasan");
  useEffect(() => {
    const fetchUser = async () => {
      // logout();
      try {
        const response = await fetchAPI(
          "http://10.192.164.54:5001/users",
          "GET",
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
    
  }, [fetchAPI]);

  return (
    <View style={styles.root}>
      <Text
        style={{
          color: colors.text,
          opacity:.55,
          fontSize:12,
          fontWeight:'bold',
          marginBottom:-10,
          marginTop:9
        }}
      >
        {month.toUpperCase()}
      </Text>
      <View style={styles.header}>
        <Text
          style={[
            styles.greetings,
            {
              color: colors.text,
            },
          ]}
        >
          Good Morning, {user}
        </Text>
        <FontAwesome name="user-circle-o" size={40} color={colors.accent} />
      </View>
      <IncomeExpense />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  greetings: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Dashboard;
