"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/lib/theme-context";
import store from "@/store/store";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";

export default function ClientProviders({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}