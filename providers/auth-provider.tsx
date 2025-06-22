import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../lib/types";
import * as SecureStore from "expo-secure-store";
import { SERVER } from "@/lib/axios";
import { router } from "expo-router";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoaing] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = await SecureStore.getItemAsync("zyntro-session");
        if (!token) return;
        const response = await SERVER.get("/users/verify-session");
        if (response.status === 200) {
          setUser(response.data);
          router.push("/(tabs)/profile");
        }
      } catch (error) {
        setUser(null);
        router.push("/login");
      } finally {
        setLoaing(false);
      }
    };
    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return value;
};
