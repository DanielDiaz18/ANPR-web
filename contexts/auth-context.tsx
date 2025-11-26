"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User, AuthState } from "@/models/auth.model";
import { AuthService } from "@/lib/auth.service";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated on mount
    const initAuth = async () => {
      const token = AuthService.getToken();
      const user = AuthService.getUser();

      if (token && user) {
        // Verify token is still valid
        const isValid = await AuthService.verifyToken();

        if (isValid) {
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token invalid, clear everything
          AuthService.logout();
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ username: email, password });

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
