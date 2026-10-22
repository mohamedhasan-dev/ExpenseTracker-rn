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

interface SegmentedToggleProps<T extends string> {
  options: readonly T[];
  activeOption: T;
  onChange: (option: T) => void;
}

const PADDING = 4;

function SegmentedToggle<T extends string>({
  options,
  activeOption,
  onChange,
}: SegmentedToggleProps<T>) {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = options.indexOf(activeOption);
  const segmentWidth =
    containerWidth > 0 ? (containerWidth - PADDING * 2) / options.length : 0;

  // Shared value tracks the position of the background pill
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (segmentWidth > 0) {
      // withSpring provides a smooth, non-distracting snap effect
      translateX.value = withSpring(activeIndex * segmentWidth, {
        damping: 45,
        stiffness: 450,
      });
    }
  }, [activeIndex, segmentWidth, translateX]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }]}
      onLayout={handleLayout}
    >
      {/* Animated Background Pill */}
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.activePill,
            { width: segmentWidth, backgroundColor: colors.surface2 },
            pillAnimatedStyle,
          ]}
        />
      )}

      {/* Touchable Options */}
      {options.map((option) => {
        const isActive = activeOption === option;

        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={styles.optionButton}
            onPress={() => onChange(option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: colors.text, opacity: isActive ? 1 : 0.5 },
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 18,
    padding: PADDING,
    position: "relative",
    height: 48,
    marginVertical: 16,
  },
  activePill: {
    position: "absolute",
    top: PADDING,
    bottom: PADDING,
    left: PADDING, // Aligns with the container's padding
    borderRadius: 15,
  },
  optionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensures the text sits above the animated pill
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default SegmentedToggle;
