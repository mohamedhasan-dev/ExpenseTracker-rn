import { Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import useTheme from "@/hooks/useTheme";

/** Round back button; falls back to the Dashboard when there is no history */
export const goBackOrHome = () => {
  if (router.canGoBack()) router.back();
  else router.navigate("/Dashboard");
};

/** Switches to the Home tab (used where "back" must always mean Home) */
export const goHome = () => router.navigate("/Dashboard");

const BackButton = ({ onPress = goBackOrHome }: { onPress?: () => void }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: colors.text,
          backgroundColor: colors.surface,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 0.3,
    borderRadius: 20,
    padding: 4,
  },
});

export default BackButton;
