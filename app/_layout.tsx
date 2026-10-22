import { StrictMode } from "react";
import { Pressable, Text, View } from "react-native";
import type { ErrorBoundaryProps } from "expo-router";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import QueryProvider from "@/services/QueryProvider";
import { dark_colors as colors } from "@/themes/colors";
import App from "./App";

// Providers live here; App.tsx decides which part of the app is reachable.
export default function RootLayout() {
  return (
    <StrictMode>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </StrictMode>
  );
}

/**
 * Shown instead of a blank/red screen if anything crashes while rendering.
 * Lives outside the providers, so it uses the static dark palette.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        gap: 12,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>
        Something went wrong
      </Text>
      <Text style={{ color: colors.text, opacity: 0.7, textAlign: "center" }}>
        The app ran into an unexpected problem. Try again, and restart the app
        if it keeps happening.
      </Text>
      {__DEV__ && (
        <Text style={{ color: colors.accent, fontSize: 12, textAlign: "center" }}>
          {error.message}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        onPress={retry}
        style={{
          marginTop: 8,
          paddingVertical: 12,
          paddingHorizontal: 28,
          borderRadius: 14,
          backgroundColor: colors.accent,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Try again</Text>
      </Pressable>
    </View>
  );
}
