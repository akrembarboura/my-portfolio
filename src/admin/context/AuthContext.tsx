import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../../supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface ExtendedAdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  avatar_url?: string;
  rawUser?: User;
}

export interface AuthContextValue {
  user: ExtendedAdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function formatUser(supabaseUser: User | null): ExtendedAdminUser | null {
  if (!supabaseUser) return null;
  const email = supabaseUser.email || 'admin@portfolio.local';
  const name = supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || email.split('@')[0] || 'Administrateur';
  const role = supabaseUser.user_metadata?.role || 'Admin';
  const avatarUrl = supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.avatarUrl || undefined;

  return {
    id: supabaseUser.id,
    email,
    name,
    role,
    avatarUrl,
    avatar_url: avatarUrl,
    rawUser: supabaseUser,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedAdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(formatUser(session?.user ?? null));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(formatUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: 'Invalid email or password.' };
    }
    return { error: null };
  };

  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signOut, logout: signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}