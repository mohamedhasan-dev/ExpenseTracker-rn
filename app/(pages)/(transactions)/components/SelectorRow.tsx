import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import useTheme from "@/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface SelectorRowProps {
  label: string;
  value: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

const SelectorRow: React.FC<SelectorRowProps> = ({
  label,
  value,
  icon = "chevron-right", // Default icon if none is provided
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: colors.surface2,
            opacity: pressed ? 0.8 : 1, // Gives a slight fade effect when tapped
          },
        ]}
      >
        <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={colors.text}
          style={{ opacity: 0.6 }} // Mutes the icon slightly so it isn't distracting
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24, 
  },
  label: {
    opacity: 0.5,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  row: {
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  valueText: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default SelectorRow;
