"use client";

import { AuthProvider } from "@/context/AuthContext";
import store from "@/store/store";
import { Provider } from "react-redux";

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}