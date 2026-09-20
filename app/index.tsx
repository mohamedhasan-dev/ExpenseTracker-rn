import { StrictMode } from "react";
import App from "./App";
import { ThemeProvider } from "@/hooks/useTheme";

export default function Index() {
  return (
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}
