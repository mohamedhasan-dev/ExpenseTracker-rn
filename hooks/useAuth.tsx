import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import loginFn from "../app/(auth)/services/login";

interface AuthContextType {
  authenticate: {
    isAuthenticated: boolean;
    Token: string | null;
  };
  isLoading: boolean;
  login: (nameoremail: string, password: string) => Promise<string | false>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticate, setAuthenticate] = useState<
    AuthContextType["authenticate"]
  >({
    isAuthenticated: false,
    Token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const Token = await SecureStore.getItemAsync("token");
        if (Token) {
          setAuthenticate({
            isAuthenticated: true,
            Token: Token,
          });
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setAuthenticate({
      isAuthenticated: false,
      Token: null,
    });
  };

  const login = async (nameoremail: string, password: string) => {
    const token = await loginFn(nameoremail, password);
    if (token) {
      await SecureStore.setItemAsync("token", token);
      setAuthenticate({
        isAuthenticated: true,
        Token: token,
      });
    }
    return token;
  };

  return (
    <AuthContext.Provider value={{ authenticate, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export default useAuth;
