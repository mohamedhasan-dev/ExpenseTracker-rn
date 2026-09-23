import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import Login from "./(auth)/Login";
import Dashboard from "./(pages)/(dashboard)/Dashboard";

const App = () => {
  const { authenticate, isLoading } = useAuth();
  const { colors } = useTheme();

  // Wait until the saved token has been read from SecureStore
  // if (isLoading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: colors.background,
  //       }}
  //     >
  //       <ActivityIndicator size="large" color={colors.accent} />
  //     </View>
  //   );
  // }

  // if (!authenticate.isAuthenticated) {
  //   return <Login />;
  // }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Dashboard />
    </SafeAreaView>
  );
};

export default App;
