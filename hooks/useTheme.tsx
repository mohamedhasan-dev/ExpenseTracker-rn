import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ColorsType, dark_colors, light_colors } from "../themes/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorsType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setDarkMode] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("isDarkMode").then((value) => {
      if (value) setDarkMode(JSON.parse(value));
    });
  }, []);

  const toggleDarkMode = async() => {
    let newMode = !isDarkMode
    setDarkMode(newMode)
    await AsyncStorage.setItem("isDarkMode",JSON.stringify(newMode))
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