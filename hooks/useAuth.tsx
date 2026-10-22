import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import loginFn, { signup as signupFn } from "../app/(auth)/services/login";
import { clearQueryCache } from "@/services/queryClient";

/** login/signup never throw; on failure they resolve with a message to show */
export type AuthOutcome =
  | { ok: true }
  | { ok: false; error: string; invalidCredentials?: boolean };

interface AuthContextType {
  authenticate: {
    isAuthenticated: boolean;
    Token: string | null;
  };
  isLoading: boolean;
  login: (nameoremail: string, password: string) => Promise<AuthOutcome>;
  signup: (name: string, email: string, password: string) => Promise<AuthOutcome>;
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
        // Unreadable secure storage: start logged out instead of crashing
        if (__DEV__) console.warn("Couldn't read the saved login", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
    } catch (error) {
      if (__DEV__) console.warn("Couldn't remove the saved login", error);
    }
    // Cached data belongs to this user; don't show it to the next one
    await clearQueryCache();
    // Always end up logged out, even if storage failed
    setAuthenticate({
      isAuthenticated: false,
      Token: null,
    });
  };

  const saveToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync("token", token);
    } catch (error) {
      // Still log in for this session; they'll just need to log in again next launch
      if (__DEV__) console.warn("Couldn't save the login token", error);
    }
    await clearQueryCache(); // fresh cache for the account that just signed in
    setAuthenticate({
      isAuthenticated: true,
      Token: token,
    });
  };

  const login = async (
    nameoremail: string,
    password: string,
  ): Promise<AuthOutcome> => {
    const result = await loginFn(nameoremail, password);
    if (!result.ok) return result;
    await saveToken(result.token);
    return { ok: true };
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthOutcome> => {
    const result = await signupFn(name, email, password);
    if (!result.ok) return result;
    await saveToken(result.token);
    return { ok: true };
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
