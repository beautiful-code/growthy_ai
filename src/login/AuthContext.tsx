import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabaseClient } from "supabaseClient";

// Define the shape of the context state
interface AuthContextType {
  session: Session | null;
  isAuthenticated: boolean;
}

// Create a context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Fetch the current session asynchronously
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (session) {
        setSession(session);
      } else {
        window.location.pathname = "/login";
      }
    };

    if (window.location.pathname !== "/login") {
      fetchSession();
    }

    // Listen for changes to auth state (login, logout)
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
