import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}

/** Inline, non-blocking error message; the whole banner retries when onRetry is set */
const ErrorBanner = ({ message, onRetry, retrying }: ErrorBannerProps) => {
  const { colors } = useTheme();
  // When offline a retry fails instantly, so keep the spinner up briefly after a tap;
  // otherwise it flickers and the tap looks like it did nothing
  const [justPressed, setJustPressed] = useState(false);
  useEffect(() => {
    if (!justPressed) return;
    const timer = setTimeout(() => setJustPressed(false), 800);
    return () => clearTimeout(timer);
  }, [justPressed]);
  const busy = !!retrying || justPressed;

  return (
    <Pressable
      accessibilityRole={onRetry ? "button" : "alert"}
      accessibilityLabel={onRetry ? `${message} Retry` : message}
      accessibilityState={{ busy }}
      disabled={!onRetry || busy}
      onPress={() => {
        setJustPressed(true);
        onRetry?.();
      }}
      style={({ pressed }) => [
        styles.banner,
        {
          backgroundColor: colors.surface,
          borderColor: colors.surface2,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.warning} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {onRetry && (
        <View style={styles.action}>
          {busy ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialCommunityIcons name="refresh" size={18} color={colors.warning} />
          )}
          <Text style={[styles.retry, { color: colors.warning }]}>Retry</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textMuted}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  retry: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ErrorBanner;
