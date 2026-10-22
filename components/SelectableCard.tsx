import React from "react";
import { Text, StyleSheet, Pressable, Dimensions } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.floor((width - 48 - 24) / 3) - 1;

interface SelectableCardProps {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap; // Made optional
  isActive: boolean;
  onPress: () => void;
  flex?: number;
  height?: number;
  labelSize?: number; // Optional label size
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  icon,
  isActive,
  onPress,
  flex,
  height = 86,
  labelSize,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width: flex ? undefined : CARD_WIDTH,
          flex: flex,
          height: height,
          backgroundColor: isActive ? "hsla(348, 100%, 61%, 0.1)" : colors.surface2,
          borderColor: isActive ? colors.accent : "transparent",
          borderWidth: 1,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={isActive ? colors.accent : colors.text}
        />
      )}
      <Text
        style={[
          styles.label,
          { 
            color: isActive ? colors.accent : colors.text,
            marginTop: icon ? 8 : 0, // Removes gap if there is no icon
            fontSize: labelSize,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default SelectableCard;