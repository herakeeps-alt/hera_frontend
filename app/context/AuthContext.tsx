"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi, tokenStore, type AuthUser } from "@/lib/api";

export const roleColors: Record<string, string> = {
  ministry: "var(--blue)", donor: "var(--green)",
  school_admin: "var(--gold)", parent: "#a78bfa", auditor: "var(--red)",
};
export const roleLabels: Record<string, string> = {
  ministry: "Ministry Officer", donor: "Donor / NGO",
  school_admin: "School Admin", parent: "Parent", auditor: "Auditor",
};

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginAs: (user: AuthUser) => void; // for demo role-switcher
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null, login: async () => {}, loginAs: () => {},
  logout: () => {}, isLoading: true, error: null,
});

const USER_KEY = "hk_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const saved = sessionStorage.getItem(USER_KEY);
      const token = tokenStore.getAccess();
      if (saved && token) {
        try {
          // Re-validate token with backend
          const me = await authApi.me();
          setCurrentUser(me);
          sessionStorage.setItem(USER_KEY, JSON.stringify(me));
        } catch {
          tokenStore.clear();
          sessionStorage.removeItem(USER_KEY);
        }
      }
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const tokens = await authApi.login(email, password);
    tokenStore.set(tokens);
    const me = await authApi.me();
    setCurrentUser(me);
    sessionStorage.setItem(USER_KEY, JSON.stringify(me));
  };

  // Demo role switcher — switches to a pre-seeded user via login
  const loginAs = (user: AuthUser) => {
    setCurrentUser(user);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    tokenStore.clear();
    sessionStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, loginAs, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
