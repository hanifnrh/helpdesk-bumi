// src/contexts/AuthContext.tsx
import { supabase } from "@/lib/utils/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    setLoading(true);

    // 1. First check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setLoading(false);
      }
    });

    // 2. Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle user session with profile data
  const handleUserSession = async (user: any) => {
    try {
      // Fetch profile data
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const userData = {
        ...user,
        ...(profile || {}),
        role: profile?.role || "user", // Default role
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // Fallback to basic user data if profile fetch fails
      setUser({ ...user, role: "user" });
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await handleUserSession(data.user);

      // Navigate based on role
      const role = data.user?.role || user?.role || "user";
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
