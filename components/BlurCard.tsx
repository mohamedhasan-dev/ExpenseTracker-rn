import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import React from "react";

interface BlurCardProps {
  children: React.ReactNode;
  style: ViewStyle;
}

const BlurCard = (props: BlurCardProps) => {
  return (
    <View style={[props.style,{
        borderWidth:1,
        borderColor:'hsla(0, 0%, 100%, 0.10)',
        overflow:'hidden',
        backgroundColor:'hsla(0, 0%, 100%, 0.05)'
    }]}>
      <BlurView intensity={20} tint="dark" style={[StyleSheet.absoluteFill]} />
      <View style={{ alignItems: "center" }}>{props.children}</View>
    </View>
  );
};

export default BlurCard;
