import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";
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
  value: string;
  isWrongCred: boolean;
  keyboardType?: KeyboardTypeOptions;
  setValue: (value: string) => void;
};

const Textinput = (props: TextInputProps) => {
  const top = useSharedValue(23);
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const animateLabelOnFocus = () => {
    top.value = withSpring(1);
    setFocused(true);
  };
  const animateLabelOnBlur = () => {
    props.value || (top.value = withSpring(23, SnappySpringConfig));
    setFocused(false);
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
      fontSize:17,
      borderBottomColor: props.isWrongCred
        ? "red"
        : focused
          ? colors.primary
          : colors.secondary,
      borderBottomWidth: 1,
      width: 330,
      marginVertical: 15,
    }
  });

  return (
    <View>
      <Animated.View style={[styles.inputlabel, labelStyle]}>
        <Text
          style={{
            color: props.isWrongCred ? "red" : "hsl(192, 73%, 40%)",
            fontSize: 15,
            fontWeight: "bold",
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
          keyboardType={props.keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

export default Textinput;
