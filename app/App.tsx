import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import Login from "./(auth)/Login";
import Dashboard from "./(pages)/(dashboard)/Dashboard";
import useTheme from "@/hooks/useTheme";

const App = () => {
  // const { authenticate } = useAuth();
  // if (!authenticate.isAuthenticated) {
  //   return <Login />;
  // }
  const {colors} = useTheme()
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
      <Dashboard />
    </SafeAreaView>
  );
};

export default App;
