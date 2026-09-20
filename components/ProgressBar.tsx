import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface ProgressBarProps {
  size: number; //height and width
  height?: number;
  width?: number | '100%';
  progress: number;
  trackColor: string; //Background unfilled color
  fillColor: string;
}

const ProgressBar = (props: ProgressBarProps) => {
  const height = props.height || props.size * 0.15;
  const width = props.width || props.size * 2;
  return (
    <View
      style={[
        styles.track,
        { backgroundColor: props.trackColor, height, width },
      ]}
    >
      <View
        style={[
          styles.fill,
          { backgroundColor: props.fillColor, height, width: `${props.progress}%` },
        ]}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    position: "absolute",
    zIndex: 0,
    borderRadius:20,
  },
  fill: {
    borderRadius:20,
    position: "absolute",
    zIndex: 1,
  },
});
 
export default ProgressBar;
