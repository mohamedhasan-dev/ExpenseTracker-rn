import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ColorsType, dark_colors, light_colors } from "../themes/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorsType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {


  const [isDarkMode, setDarkMode] = useState(true);
  const deviceTheme  = useColorScheme();


  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("isDarkMode");
        if (value !== null) {
          setDarkMode(JSON.parse(value) === true);
          return;
        }
      } catch (error) {
        // Unreadable or corrupt preference: fall back to the device setting
        if (__DEV__) console.warn("Couldn't read the theme preference", error);
      }
      setDarkMode(deviceTheme === "dark");
    })();
  }, [deviceTheme]);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setDarkMode(newMode); // switch immediately; saving is best-effort
    try {
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(newMode));
    } catch (error) {
      if (__DEV__) console.warn("Couldn't save the theme preference", error);
    }
  };

  const colors = isDarkMode ? dark_colors : light_colors

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default useTheme;