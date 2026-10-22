import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}

/** Inline, non-blocking error message with an optional Retry action */
const ErrorBanner = ({ message, onRetry, retrying }: ErrorBannerProps) => {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.banner,
        { backgroundColor: colors.surface, borderLeftColor: colors.accent },
      ]}
    >
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={20}
        color={colors.accent}
      />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {onRetry &&
        (retrying ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onRetry}>
            <Text style={[styles.retry, { color: colors.accent }]}>Retry</Text>
          </Pressable>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
  },
  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  retry: {
    fontSize: 13,
    fontWeight: "700",
  },
});

export default ErrorBanner;
