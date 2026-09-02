import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import Login from "./(auth)/Login";
import Dashboard from "./(pages)/Dashboard";

const App = () => {
  const { authenticate } = useAuth();
  if (!authenticate.isAuthenticated) {
    return <Login />;
  }
  return (
    <SafeAreaView>
      <Dashboard />
    </SafeAreaView>
  );
};

export default App;
