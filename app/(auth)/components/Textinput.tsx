import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import useTheme from "@/hooks/useTheme";
import Animated, {
  SnappySpringConfig,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type TextInputProps = {
  Label: string;
  password?: boolean;
};

const Textinput = (props: TextInputProps) => {
  const top = useSharedValue(23);
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState("");

  const animateLabelOnFocus = () => {
    top.value = withSpring(6);
  };
  const animateLabelOnBlur = () => {
    inputValue || (top.value = withSpring(23, SnappySpringConfig));
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
    },
    // inputField: {
    //   flexDirection: "row",
    //   alignItems: "flex-end",
    //   borderBottomColor: colors.primary,
    //   borderBottomWidth: 1,
    //   width: 350,
    // },
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
          onChangeText={setInputValue}
          onFocus={animateLabelOnFocus}
          onBlur={animateLabelOnBlur}
          value={inputValue}
          secureTextEntry={props.password ? true : false}
        />
      </View>
    </View>
  );
};

export default Textinput;
