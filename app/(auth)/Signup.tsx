import { View, Text, StyleSheet, Pressable } from "react-native";
import useTheme from "@/hooks/useTheme";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import Textinput from "./components/Textinput";
import { useState } from "react";

const Signup = () => {
  const { colors } = useTheme();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pword, setPword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // Login lives on the index route (App.tsx shows it when logged out)
  const goToLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const handleSignup = async () => {
    if (isLoading) return;
    if (!name.trim() || !email.trim() || !pword) {
      setError("Please fill in all fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const err = await signup(name.trim(), email.trim(), pword);
      if (err) {
        setError(err);
        return;
      }
      // Logged in now; index route renders the Dashboard
      router.replace("/");
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
      <Textinput
        Label="USERNAME"
        value={name}
        setValue={setName}
        isWrongCred={false}
      />
      <Textinput
        Label="EMAIL"
        value={email}
        setValue={setEmail}
        keyboardType="email-address"
        isWrongCred={false}
      />
      <Textinput
        Label="PASSWORD"
        password
        value={pword}
        setValue={setPword}
        isWrongCred={false}
      />
      {error && (
        <Text style={{ color: "red", fontSize: 14, marginTop: 4 }}>
          {error}
        </Text>
      )}
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "hsl(358, 46%, 38%)" : colors.accent,
          },
          styles.submitbtn,
        ]}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text
          style={{
            color: "hsl(355, 53%, 24%)",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {isLoading ? "Loading..." : "Create Account"}
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
        Already have an account:{" "}
        <Text
          onPress={goToLogin}
          style={{
            color: colors.accent,
            fontWeight: "500",
          }}
        >
          Login
        </Text>
      </Text>
    </View>
  );
};

export default Signup;
