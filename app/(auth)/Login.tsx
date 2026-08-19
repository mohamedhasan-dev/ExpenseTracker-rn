import { View, Text, StyleSheet, Pressable } from "react-native";
import useTheme from "@/hooks/useTheme";
import { Link } from "expo-router";
import Textinput from "./components/Textinput";

const Login = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    root: {
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    submitbtn: {
      backgroundColor: colors.accent,
      width: 150,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      borderRadius: 10,
    },
  });

  return (
    <View style={styles.root}>
      <Textinput Label="Username/email" />
      <Textinput Label="Password" password/>
      <Pressable style={styles.submitbtn}>
        <Text
          style={{
            color: "hsl(355, 53%, 24%",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          LogIn
        </Text>
      </Pressable>
      <Text
        style={{
          fontSize: 20,
          marginTop: 15,
          color: colors.primary,
          fontWeight: "300",
        }}
      >
        don&apos;t have an account:
        <Link
          href={"/(auth)/Signup"}
          style={{
            color: colors.accent,
            fontWeight: "500",
          }}
        >
          Login
        </Link>
      </Text>
    </View>
  );
};

export default Login;
