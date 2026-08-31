import useAuth from "../hooks/useAuth";
import Login from "./(auth)/Login";
import Dashboard from "./(pages)/Dashboard";

const App = () => {
  const { authenticate } = useAuth();
  if (!authenticate.isAuthenticated) {
    return <Login />;
  }
  return <Dashboard />;
};

export default App;
