import { View, Text, StyleSheet, TextInput } from "react-native";
import useTheme from "@/hooks/useTheme";
import Animated, {
  SnappySpringConfig,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useState } from "react";

type TextInputProps = {
  Label: string;
  password?: boolean;
  value:string;
  setValue: (value:string) => void
};

const Textinput = (props: TextInputProps) => {
  const top = useSharedValue(23);
  const { colors } = useTheme();

  const animateLabelOnFocus = () => {
    top.value = withSpring(6);
  };
  const animateLabelOnBlur = () => {
    props.value || (top.value = withSpring(23, SnappySpringConfig));
  };

  const labelStyle = useAnimatedStyle(() => {
    return {
      top: top.value,
    };
  });

  const styles = StyleSheet.create({
    inputlabel: {
      position: "absolute",
      left: 5,
    },
    input: {
      color: colors.text,
      borderBottomColor: colors.primary,
      borderBottomWidth: 1,
      width: 350,
      marginVertical: 15,
    }
  });

  return (
    <View>
      <Animated.View style={[styles.inputlabel, labelStyle]}>
        <Text
          style={{
            color: colors.secondary,
            fontSize: 13,
          }}
        >
          {props.Label}
        </Text>
      </Animated.View>
      <View>
        <TextInput
          style={styles.input}
          cursorColor={colors.accent}
          onChangeText={props.setValue}
          onFocus={animateLabelOnFocus}
          onBlur={animateLabelOnBlur}
          value={props.value}
          secureTextEntry={props.password ? true : false}
        />
      </View>
    </View>
  );
};

export default Textinput;
