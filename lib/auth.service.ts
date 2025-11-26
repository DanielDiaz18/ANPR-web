import qs from "qs";
import axiosInstance from "./axiosInstance";
import type { AuthResponse, LoginCredentials, User } from "@/models/auth.model";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = qs.stringify(credentials);
    console.log("Logging in with:", formData);
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }

    return response.data;
  }

  // Logout
  static logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Get stored token
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  // Set token
  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Get stored user
  static getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set user
  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Check if token is valid (basic check, you might want to verify with backend)
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode JWT token (basic validation)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  // Verify token with backend
  static async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      await axiosInstance.get("/auth/verify");
      return true;
    } catch {
      return false;
    }
  }

  // Get current authenticated user from backend
  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosInstance.get<User>("/auth/me");
      return response.data;
    } catch {
      return null;
    }
  }
}
