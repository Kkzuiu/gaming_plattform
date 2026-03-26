"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User } from "@/lib/types";
import { loginUser, getUserById, registerUser, addToLibrary as apiAddToLibrary, removeFromLibrary as apiRemoveFromLibrary } from "@/lib/api";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  country?: string;
  birthYear?: number;
  preferredLanguage?: string;
  discordTag?: string;
  bio?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addToLibrary: (gameId: string) => Promise<boolean>;
  removeFromLibrary: (gameId: string) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (token && storedUserId) {
      getUserById(storedUserId).then(u => {
        setUser(u);
      }).catch(err => {
        console.error("Failed to restore session", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(email, password);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
      }
      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await registerUser(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.user._id);
      }
      setUser(result.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
  }, []);

  const addToLibrary = useCallback(async (gameId: string) => {
    try {
      await apiAddToLibrary(gameId);
      // Re-fetch full user to ensure consistent state
      const freshUser = await getUserById("me");
      setUser(freshUser);
      return true;
    } catch {
      return false;
    }
  }, []);

  const removeFromLibrary = useCallback(async (gameId: string) => {
    try {
      await apiRemoveFromLibrary(gameId);
      // Re-fetch full user to ensure consistent state
      const freshUser = await getUserById("me");
      setUser(freshUser);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, addToLibrary, removeFromLibrary, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
