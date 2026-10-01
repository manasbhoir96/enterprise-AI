import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../lib/api.js";
import type { User, Organization, RegisterTenantInput, LoginInput } from "@nexusai/shared";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  isLoading: boolean;
  customApiKey: string | null;
  login: (credentials: LoginInput) => Promise<void>;
  register: (payload: RegisterTenantInput) => Promise<void>;
  logout: () => void;
  setCustomApiKey: (key: string | null) => void;
  quickDemoLogin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nexus_token"));
  const [customApiKey, setApiKeyState] = useState<string | null>(() => localStorage.getItem("nexus_gemini_key"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setCustomApiKey = (key: string | null) => {
    if (key && key.trim()) {
      localStorage.setItem("nexus_gemini_key", key.trim());
      setApiKeyState(key.trim());
    } else {
      localStorage.removeItem("nexus_gemini_key");
      setApiKeyState(null);
    }
  };

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiRequest<{ user: User & { org_name?: string; industry?: string } }>("/auth/me");
        setUser(res.user);
        setOrganization({
          id: res.user.organization_id,
          name: res.user.org_name || "Enterprise Tenant",
          industry: res.user.industry || null,
          created_at: res.user.created_at,
        });
      } catch (err) {
        console.warn("Failed to validate token:", err);
        localStorage.removeItem("nexus_token");
        setToken(null);
        setUser(null);
        setOrganization(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (credentials: LoginInput) => {
    const res = await apiRequest<{
      token: string;
      user: User;
      organization: Organization;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    localStorage.setItem("nexus_token", res.token);
    setToken(res.token);
    setUser(res.user);
    setOrganization(res.organization);
  };

  const register = async (payload: RegisterTenantInput) => {
    const res = await apiRequest<{
      token: string;
      user: User;
      organization: Organization;
    }>("/auth/register-tenant", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    localStorage.setItem("nexus_token", res.token);
    setToken(res.token);
    setUser(res.user);
    setOrganization(res.organization);
  };

  const quickDemoLogin = async (email: string) => {
    await login({
      email,
      password: "password123",
    });
  };

  const logout = () => {
    localStorage.removeItem("nexus_token");
    setToken(null);
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        isLoading,
        customApiKey,
        login,
        register,
        logout,
        setCustomApiKey,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
