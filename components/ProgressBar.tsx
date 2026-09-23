import { DimensionValue, View } from "react-native";
import React from "react";

interface ProgressBarProps {
  size: number; //height and width
  height?: number;
  width?: DimensionValue;
  progress: number; // 0-100
  trackColor: string; //Background unfilled color
  fillColor: string;
}

const ProgressBar = (props: ProgressBarProps) => {
  const height = props.height ?? props.size * 0.15;
  const width = props.width ?? props.size * 2;
  const progress = Math.min(100, Math.max(0, props.progress || 0));

  // Track stays in normal layout flow so it takes up real space;
  // the fill is clipped inside it.
  return (
    <View
      style={{
        height,
        width,
        backgroundColor: props.trackColor,
        borderRadius: height,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: props.fillColor,
          borderRadius: height,
        }}
      />
    </View>
  );
};

export default ProgressBar;
