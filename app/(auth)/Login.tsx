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

  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const token = await login(name, pword);
      if (token) {
        setWrongCred(false);
        return token;
      }
      setWrongCred(true);
    } catch (e) {
      return false;
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
        experimentalBlurMethod="dimezisBlurView"
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
          setValue={setName}
          isWrongCred={isWorngCred}
        />
        <Textinput
          Label="PASSWORD"
          password
          value={pword}
          setValue={setPword}
          isWrongCred={isWorngCred}
        />
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "hsl(358, 46%, 38%)" : colors.accent,
            },
            styles.submitbtn,
          ]}
          onPress={handleLogin}
        >
          <Text
            style={{
              color: "hsl(186, 70%, 70%)",
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
          Don&apos;t have an account:{"\n"}
          <Pressable onPress={() => router.push("/(auth)/Signup")}>
            <Text
              style={{
                color: colors.accent,
                fontWeight: "400",
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
