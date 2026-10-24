"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loginAsDemo: (customName?: string) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<AppUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Initialize session from Supabase or localStorage demo session
  React.useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. Check local demo session first
      const storedDemo = localStorage.getItem("matchingteam_demo_user");
      if (storedDemo) {
        try {
          const parsed = JSON.parse(storedDemo);
          if (mounted) {
            setUser(parsed);
            setLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem("matchingteam_demo_user");
        }
      }

      // 2. If Supabase is configured, check real session
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (mounted) {
            if (data?.session) {
              setSession(data.session);
              const sbUser = data.session.user;
              setUser({
                id: sbUser.id,
                email: sbUser.email || "",
                full_name: sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0] || "Sinh viên",
                avatar_url: sbUser.user_metadata?.avatar_url,
              });
            }
          }
        } catch (e) {
          console.warn("Supabase auth check error:", e);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes if configured
    let subscription: any = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        if (currentSession?.user) {
          const sbUser = currentSession.user;
          setUser({
            id: sbUser.id,
            email: sbUser.email || "",
            full_name: sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0] || "Sinh viên",
            avatar_url: sbUser.user_metadata?.avatar_url,
          });
        } else if (!localStorage.getItem("matchingteam_demo_user")) {
          setUser(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Protected Route Guard: Redirect to /login if not authenticated
  React.useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.some(
      (route) => pathname === route || (route !== "/" && pathname?.startsWith(route))
    );

    if (!user && !isPublic) {
      const redirectUrl = encodeURIComponent(pathname || "/dashboard");
      router.push(`/login?redirect=${redirectUrl}`);
    } else if (user && (pathname === "/login" || pathname === "/register")) {
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      loginAsDemo(email.split("@")[0]);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || "",
        full_name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Sinh viên",
      });
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      loginAsDemo(fullName);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error && data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || "",
        full_name: fullName,
      });
    }

    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem("matchingteam_demo_user");
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    router.push("/login");
  };

  const loginAsDemo = (customName?: string) => {
    const demoUser: AppUser = {
      id: "demo-user-12345",
      email: "nam.le@matchingteam.dev",
      full_name: customName || "Lê Hoàng Nam",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      role: "Team Lead",
    };
    localStorage.setItem("matchingteam_demo_user", JSON.stringify(demoUser));
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within an AuthProvider");
  }
  return context;
}
