import { View, Text } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import { ColorsType } from "@/themes/colors";

const App = () => {
  const { colors }: { colors: ColorsType } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text>Root Node</Text>
    </View>
  );
};

export default App;
