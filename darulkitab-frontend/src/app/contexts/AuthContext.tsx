import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../api/axios";

/* ================================
   TYPES
================================ */

export interface User {
  id: number;
  user_name: string;
  email: string;
  user_role: string;
  is_premium: boolean;
}

interface SignupPayload {
  user_name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  refreshPremiumStatus: () => Promise<void>;
  isAuthenticated: boolean;
  isPremium: boolean;
  isAdmin: boolean;
}

/* ================================
   CONTEXT
================================ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================================
   PROVIDER
================================ */

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize synchronously from localStorage to avoid flash of login page
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("jwt_token");
  });

  /* -------------------------------
     Restore axios header on mount
  -------------------------------- */
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  const persistSession = ({ token, user }: AuthResponse) => {
    setToken(token);
    setUser(user);

    localStorage.setItem("jwt_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  /* -------------------------------
     LOGIN
  -------------------------------- */
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<AuthResponse>("/auth/login.php", {
        email,
        password,
      });

      persistSession(res.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const res = await api.post<AuthResponse>("/auth/google-login.php", {
        credential,
      });

      persistSession(res.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Google sign-in failed. Please try again.";
      throw new Error(message);
    }
  };

  /* -------------------------------
     SIGNUP (auto-login)
  -------------------------------- */
  const signup = async (payload: SignupPayload) => {
    try {
      const res = await api.post<AuthResponse>("/auth/signup.php", {
        user_name: payload.user_name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone ?? null,
      });

      persistSession(res.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Signup failed. Please try again.";
      throw new Error(message);
    }
  };

  /* -------------------------------
     REFRESH PREMIUM STATUS
  -------------------------------- */
  const refreshPremiumStatus = async () => {
    try {
      const res = await api.get("/razorpay/subscription_status.php");
      const isPrem = res.data?.is_premium === true;
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        const updatedUser = { ...prevUser, is_premium: isPrem };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch {
      // Silently fail — premium status unchanged
    }
  };

  /* -------------------------------
     Keep premium in sync on app load
  -------------------------------- */
  useEffect(() => {
    if (token && user) {
      refreshPremiumStatus();
    }
  }, [token]);

  /* -------------------------------
     LOGOUT
  -------------------------------- */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common.Authorization;
  };

  /* ================================
     PROVIDER VALUE
  ================================ */

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginWithGoogle,
        signup,
        logout,
        refreshPremiumStatus,
        isAuthenticated: !!user,
        isPremium: user?.is_premium === true,
        isAdmin: user?.user_role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================================
   HOOK
================================ */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
