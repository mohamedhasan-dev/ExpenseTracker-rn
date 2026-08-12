import App from "./App";
import { ThemeProvider } from "@/hooks/useTheme";

export default function Index() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
