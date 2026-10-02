import useTheme from "@/hooks/useTheme";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface SegmentedToggleProps {
  options: ('Expense' | 'Income')[];
  activeOption: 'Expense' | 'Income';
  onChange: (option: 'Expense' | 'Income') => void;
}

export const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  options,
  activeOption,
  onChange,
}) => {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = options.indexOf(activeOption);

  // Shared value tracks the position of the background pill
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (containerWidth > 0) {
      const segmentWidth = (containerWidth - 8) / options.length; // -8 accounts for the 4px horizontal padding
      // withSpring provides a smooth, non-distracting snap effect
      translateX.value = withSpring(activeIndex * segmentWidth, {
        damping: 45,
        stiffness: 450,
      });
    }
  }, [activeIndex, containerWidth, options.length]);

  const pillAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: containerWidth > 0 ? (containerWidth - 4) / options.length : 0,
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface}]}
      onLayout={handleLayout}
    >
      {/* Animated Background Pill */}
      {containerWidth > 0 && (
        <Animated.View style={[styles.activePill, pillAnimatedStyle,{
            backgroundColor:colors.surface2
        }]} />
      )}

      {/* Touchable Options */}
      {options.map((option) => {
        const isActive = activeOption === option;

        return (
          <Pressable
            key={option}
            style={styles.optionButton}
            onPress={() => onChange(option)}
          >
            <Text style={[styles.optionText, isActive && styles.activeText]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 4,
    position: "relative",
    height: 48,
    marginVertical: 16,
  },
  activePill: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4, // Aligns with the container's padding
    borderRadius: 15,
  },
  optionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensures the text sits above the animated pill
  },
  optionText: {
    color: "#8A8A93",
    fontSize: 15,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFFFFF", // Pops out when the pill slides under it
  },
});
