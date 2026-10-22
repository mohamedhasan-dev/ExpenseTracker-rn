import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import useTheme from "@/hooks/useTheme";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import Textinput from "./components/Textinput";
import { useState } from "react";
import { BlurView } from "expo-blur";

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
      // signup() never throws: it resolves with { ok } or a message to show
      const result = await signup(name.trim(), email.trim(), pword);
      if (!result.ok) {
        setError(result.error);
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
    blurBox: {
      backgroundColor: "hsla(210, 27%, 13%, 0.50)",
      borderColor: "hsla(192, 73%, 30%, 0.51)",
      borderWidth: 1,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      paddingTop: 150,
      paddingBottom: 70,
      paddingHorizontal: 5,
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
    <ImageBackground
      style={styles.root}
      source={require("@/assets/images/login_bg.png")}
      resizeMode="cover"
    >
      <BlurView style={styles.blurBox} intensity={12} tint="dark">
        <View>
          <Text
            style={{
              marginTop: -100,
              fontSize: 25,
              fontWeight: "400",
              color: "hsl(186, 70%, 80%)",
            }}
          >
            Create an Account
          </Text>
        </View>
        <Textinput
          Label="USERNAME"
          value={name}
          setValue={(v) => {
            setName(v);
            setError(null);
          }}
          isWrongCred={false}
        />
        <Textinput
          Label="EMAIL"
          value={email}
          setValue={(v) => {
            setEmail(v);
            setError(null);
          }}
          keyboardType="email-address"
          isWrongCred={false}
        />
        <Textinput
          Label="PASSWORD"
          password
          value={pword}
          setValue={(v) => {
            setPword(v);
            setError(null);
          }}
          isWrongCred={false}
        />
        {error && (
          <Text
            accessibilityLiveRegion="polite"
            style={{
              color: "hsl(0, 85%, 72%)",
              fontSize: 14,
              textAlign: "center",
              maxWidth: 320,
              marginTop: 4,
            }}
          >
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
      </BlurView>
    </ImageBackground>
  );
};

export default Signup;
