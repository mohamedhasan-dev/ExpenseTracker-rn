import {
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  View,
} from "react-native";
import useTheme from "@/hooks/useTheme";
import { router } from "expo-router";
import Textinput from "./components/Textinput";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { BlurView } from "expo-blur";

const Login = () => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [pword, setPword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isWorngCred, setWrongCred] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  // Typing again clears the previous error
  const editName = (value: string) => {
    setName(value);
    setWrongCred(false);
    setError(null);
  };
  const editPassword = (value: string) => {
    setPword(value);
    setWrongCred(false);
    setError(null);
  };

  const handleLogin = async () => {
    if (isLoading) return;
    if (!name.trim() || !pword) {
      setError("Enter your username/email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // login() never throws: it resolves with { ok } or a message to show
      const result = await login(name.trim(), pword);
      if (!result.ok) {
        setError(result.error);
        // Only highlight the fields when the credentials were wrong, not for network errors
        setWrongCred(!!result.invalidCredentials);
      }
      // On success the app switches to the dashboard automatically
    } finally {
      setLoading(false);
    }
  };
  const styles = StyleSheet.create({
    root: {
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
      borderRadius: 15,
      boxShadow: "0px 1px 10px hsl(358, 47%, 10%)",
    },
    error: {
      color: colors.warning,
      fontSize: 14,
      textAlign: "center",
      maxWidth: 320,
      marginTop: 4,
    },
  });

  return (
    <ImageBackground
      style={styles.root}
      source={require("@/assets/images/login_bg.png")}
      resizeMode="cover"
    >
      <BlurView
        style={styles.blurBox}
        intensity={12}
        tint="dark"
      >
        <View>
          <Text
            style={{
              marginTop: -100,
              fontSize: 25,
              fontWeight: "400",
              color: "hsl(186, 70%, 80%)",
            }}
          >
            Welcome
          </Text>
        </View>
        <Textinput
          Label="USERNAME/EMAIL"
          value={name}
          setValue={editName}
          isWrongCred={isWorngCred}
        />
        <Textinput
          Label="PASSWORD"
          password
          value={pword}
          setValue={editPassword}
          isWrongCred={isWorngCred}
        />
        {error && (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
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
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text
            style={{
              color: colors.onAccent,
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
            color: colors.textMuted,
            fontWeight: "300",
            textAlign: "center",
          }}
        >
          Don&apos;t have an account:{"\n"}
          <Pressable onPress={() => router.push("/(auth)/Signup")}>
            <Text
              style={{
                color: colors.primary,
                fontWeight: "700",
                fontSize:20
              }}
            >
              Create Account
            </Text>
          </Pressable>
        </Text>
      </BlurView>
    </ImageBackground>
  );
};

export default Login;
