
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { cleanupAuthState } from '@/utils/authCleanup';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Get username from user metadata
        if (session?.user) {
          setUsername(session.user.user_metadata?.username || session.user.email || 'Usuário');
        } else {
          setUsername(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.email || 'Usuário');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (username: string, token: string) => {
    // This is handled by the auth state change listener
    console.log('Login called with:', username, token);
  };

  const logout = async () => {
    console.log('Logout called');
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Global signout failed, continuing...');
      }
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload even if logout fails
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isAuthenticated, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
