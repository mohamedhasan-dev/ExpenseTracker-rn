import { View, Text } from "react-native";
import useTheme from "@/hooks/useTheme";
import { ColorsType } from "@/themes/colors";

const App = () => {
  const { colors }: { colors: ColorsType } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Text style={{color:colors.accent}}>Root Node</Text>
    </View>
  );
};

export default App;
