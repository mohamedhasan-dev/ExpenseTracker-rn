import { View, Text, StyleSheet,TextInput } from "react-native";
import { useState } from "react";
import useTheme from "@/hooks/useTheme";


type TextInputProps = {
    Label:string
}

const Textinput = (props:TextInputProps) => {
  const { colors } = useTheme();
  const [isFocused, setFocus] = useState(false);
  const styles = StyleSheet.create({
    inputlabel: {
      color: colors.secondary,
      fontSize: 13,
      position: "absolute",
      top: isFocused ? 6 : 23,
      left: 5,
    },
    input: {
      borderBottomColor: colors.primary,
      borderBottomWidth: 1,
      width: 350,
      marginVertical: 15,
    },
    inputContainer: {
      alignItems: "center",
    },
  });

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputlabel}>{props.Label}</Text>
      <TextInput
        style={styles.input}
        cursorColor={colors.accent}
        onFocus={(e) => {
          setFocus(true);
        }}
        onBlur={(e) => {
          setFocus(false);
        }}
      />
    </View>
  );
};

export default Textinput;
