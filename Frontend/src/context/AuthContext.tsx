/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
};

type Credentials = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  register?: (payload: any) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const STORAGE_KEY = "auth_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);

  const setTokenAndStore = useCallback((t: string | null) => {
    setToken(t);
    try {
      if (t) localStorage.setItem(STORAGE_KEY, t);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const fetchJson = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(init && init.headers
          ? (init.headers as Record<string, string>)
          : {}),
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(input, { ...init, headers });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const message = text || res.statusText || "Request failed";
        throw new Error(message);
      }
      return res.json().catch(() => ({}));
    },
    [token],
  );

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // endpoint expected to return current user at GET /api/auth/me
      const data = await fetchJson("/api/auth/me", { method: "GET" });
      setUser(data.user ?? data);
    } catch {
      // token invalid or network error -> clear auth
      setTokenAndStore(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchJson, setTokenAndStore, token]);

  useEffect(() => {
    // on mount, if token exists try to load user
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (credentials: Credentials) => {
      setLoading(true);
      try {
        // endpoint expected to return { token, user }
        const data = await fetchJson("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        const newToken: string | undefined = data.token ?? data.accessToken;
        if (!newToken) throw new Error("No token returned from server");
        setTokenAndStore(newToken);
        // set token state immediately so fetchJson will include it if needed
        setUser(data.user ?? null);
        // if endpoint didn't return user, fetch the profile
        if (!data.user) await refreshUser();
      } finally {
        setLoading(false);
      }
    },
    [fetchJson, refreshUser, setTokenAndStore],
  );

  const logout = useCallback(() => {
    setTokenAndStore(null);
    setUser(null);
    setLoading(false);
    // optionally notify backend
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {
      /* ignore errors */
    });
  }, [setTokenAndStore]);

  const register = useCallback(
    async (payload: any) => {
      setLoading(true);
      try {
        // endpoint expected to return { token, user } or just success
        const data = await fetchJson("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const newToken: string | undefined = data.token ?? data.accessToken;
        if (newToken) {
          setTokenAndStore(newToken);
          setUser(data.user ?? null);
          if (!data.user) await refreshUser();
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchJson, refreshUser, setTokenAndStore],
  );

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
