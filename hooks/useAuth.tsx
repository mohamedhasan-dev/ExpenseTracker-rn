import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import loginFn, { signup as signupFn } from "../app/(auth)/services/login";

interface AuthContextType {
  authenticate: {
    isAuthenticated: boolean;
    Token: string | null;
  };
  isLoading: boolean;
  login: (nameoremail: string, password: string) => Promise<string | false>;
  /** Resolves to an error message, or null when the account was created and the user is logged in. */
  signup: (name: string, email: string, password: string) => Promise<string | null>;
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

  const saveToken = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
    setAuthenticate({
      isAuthenticated: true,
      Token: token,
    });
  };

  const login = async (nameoremail: string, password: string) => {
    const token = await loginFn(nameoremail, password);
    if (token) {
      await saveToken(token);
    }
    return token;
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await signupFn(name, email, password);
    if ("token" in result) {
      await saveToken(result.token);
      return null;
    }
    return result.error;
  };

  return (
    <AuthContext.Provider value={{ authenticate, login, signup, logout, isLoading }}>
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
