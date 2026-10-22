import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";

// Login is bypassed while building the UI. Set to true to require login again.
const REQUIRE_LOGIN = true;

export const useIsLoggedIn = () => {
  const { authenticate } = useAuth();
  return !REQUIRE_LOGIN || authenticate.isAuthenticated;
};

const App = () => {
  const { isLoading } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const isLoggedIn = useIsLoggedIn();

  // Wait until the saved token has been read from SecureStore
  if (REQUIRE_LOGIN && isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Gives every navigator (root stack, tabs, per-tab stacks) the app background
  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      primary: colors.accent,
    },
  };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      {/* Themed backdrop: anything translucent during a transition blends with the
          app background instead of Android's white window */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          // Switching between login and the app (and the "/" redirect) is a swap,
          // not a navigation. Animating it let a second, near-simultaneous replace
          // (Redirect runs in an effect) interrupt the Android fade and leave the
          // (auth) screen stuck at ~60% opacity - the "whitewashed" login screen.
          animation: "none",
        }}
      >
        <Stack.Screen name="index" />
        {/* (pages) is the main app: tabs + navbar */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(pages)" />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      </View>
    </NavigationThemeProvider>
  );
};

export default App;
