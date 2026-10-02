import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SelectableCardProps {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  icon,
  isActive,
  onPress,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  // Only handling the physical scale animation here now
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.92))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      style={[
        styles.card,
        animatedStyle,
        { 
          borderWidth: 1,
          // Static color changes applied immediately based on state
          backgroundColor: isActive ? `hsla(358, 32%, 32%, 0.60)` : colors.surface2,
          borderColor: isActive ? colors.accent : "transparent",
        }
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={26}
        color={isActive ? colors.accent : colors.text}
        style={{ opacity: isActive ? 1 : 0.6 }}
      />
      <Text
        style={[
          styles.label,
          {
            color: isActive ? colors.accent : colors.text,
            opacity: isActive ? 1 : 0.6,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "31%", // Fits 3 across with space between
    aspectRatio: 1, // Keeps the cards perfectly square
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
  },
});