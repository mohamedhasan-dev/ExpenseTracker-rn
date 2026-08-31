import { View, Text, StyleSheet, Pressable } from "react-native";
import useTheme from "@/hooks/useTheme";
import { Link } from "expo-router";
import Textinput from "./components/Textinput";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [pword, setPword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isWorngCred,setWrongCred] = useState(false)

  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const token = await login(name, pword);
      if (token) {
        setWrongCred(false)
        return token;
      } setWrongCred(true)
    } catch (e) {
      return false;
    } finally {
      setLoading(false);
    }
  };
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
      <Textinput Label="Username/email" value={name} setValue={setName} isWrongCred={isWorngCred}/>
      <Textinput Label="Password" password value={pword} setValue={setPword} isWrongCred={isWorngCred}/>
      <Pressable style={styles.submitbtn} onPress={handleLogin}>
        <Text
          style={{
            color: "hsl(355, 53%, 24%",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {isLoading ? "Loading..." : "Login"}
        </Text>
      </Pressable>
      <Text
        style={{
          fontSize: 20,
          marginTop: 15,
          color: colors.primary,
          fontWeight: "300",
          textAlign: "center",
        }}
      >
        don&apos;t have an account:{"\n"}
        <Link
          href={"/(auth)/Signup"}
          style={{
            color: colors.accent,
            fontWeight: "400",
          }}
        >
          Create Account
        </Link>
      </Text>
    </View>
  );
};

export default Login;
