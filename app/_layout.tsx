import { StrictMode } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import QueryProvider from "@/services/QueryProvider";
import App from "./App";

// Providers live here; App.tsx decides which part of the app is reachable.
export default function RootLayout() {
  return (
    <StrictMode>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </StrictMode>
  );
}
