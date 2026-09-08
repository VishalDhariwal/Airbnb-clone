"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DemoUser, TokenResponse, User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isHost: boolean;
  currentRole: string;
  roles: string[];
  demoUsers: DemoUser[];
  isLoginModalOpen: boolean;
  authModalMode: "login" | "signup";
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeLoginModal: () => void;
  setAuthModalMode: (mode: "login" | "signup") => void;
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  demoLogin: (email: string) => Promise<void>;
  becomeHost: () => Promise<User>;
  switchRole: (role: "traveller" | "host") => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    // Load stored token and fetch current user
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      queueMicrotask(() => setToken(storedToken));
      api
        .get<User>("/auth/me")
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      queueMicrotask(() => setLoading(false));
    }

    // Load available demo users for switcher
    api
      .get<DemoUser[]>("/auth/demo-users")
      .then((users) => setDemoUsers(users))
      .catch(() => setDemoUsers([]));
  }, []);

  async function login(email: string, password?: string) {
    setLoading(true);
    try {
      // If password omitted, attempt default password or demo-login
      const payload = { email: email.trim().toLowerCase(), password: password || "password123" };
      const res = await api.post<TokenResponse>("/auth/login", payload);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setIsLoginModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function signup(data: { name: string; email: string; password: string }) {
    setLoading(true);
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      const res = await api.post<TokenResponse>("/auth/signup", payload);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setIsLoginModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function demoLogin(email: string) {
    setLoading(true);
    try {
      const res = await api.post<TokenResponse>("/auth/demo-login", { email: email.trim().toLowerCase() });
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setIsLoginModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function becomeHost() {
    const updatedUser = await api.post<User>("/host/onboard");
    setUser(updatedUser);
    return updatedUser;
  }

  async function switchRole(role: "traveller" | "host") {
    setLoading(true);
    try {
      const updatedUser = await api.post<User>("/auth/roles/switch", { role });
      setUser(updatedUser);
      return updatedUser;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isHost: Boolean(user?.is_host),
        currentRole: user?.role || (user?.is_host ? "host" : "traveller"),
        roles: user?.roles || (user?.is_host ? ["traveller", "host"] : ["traveller"]),
        demoUsers,
        isLoginModalOpen,
        authModalMode,
        openLoginModal: () => {
          setAuthModalMode("login");
          setIsLoginModalOpen(true);
        },
        openSignupModal: () => {
          setAuthModalMode("signup");
          setIsLoginModalOpen(true);
        },
        closeLoginModal: () => setIsLoginModalOpen(false),
        setAuthModalMode,
        login,
        signup,
        demoLogin,
        becomeHost,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
