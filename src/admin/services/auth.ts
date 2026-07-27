import { supabase } from '../../supabaseClient';
import type { AdminUser, Session } from '../types';
import { delay } from './store';

const SESSION_KEY = 'rnv_admin:session';

// Placeholder credentials for the local auth fallback. Replace by enabling
// Supabase Auth (users created in the Supabase dashboard) — the login form and
// route guards remain identical.
const DEMO_EMAIL = 'admin@rnv-peinture.fr';
const DEMO_PASSWORD = 'admin123';

const supabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

function persist(session: Session | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    const exp = session.expiresAt ?? session.expires_at ?? (Date.now() + 86400000);
    if (exp < Date.now()) {
      persist(null);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function buildDemoSession(email: string): Session {
  const user: AdminUser = {
    id: 'demo-admin',
    email,
    name: 'Administrateur',
    role: 'admin',
    avatarUrl: '',
  };
  return {
    user,
    token: `demo.${btoa(email)}.${Date.now()}`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
}

export const authService = {
  supabaseEnabled: supabaseConfigured,

  async getSession(): Promise<Session | null> {
    if (supabaseConfigured) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const u = data.session.user;
          const session: Session = {
            user: {
              id: u.id,
              email: u.email ?? '',
              name:
                (u.user_metadata?.name as string) ??
                (u.email ? u.email.split('@')[0] : 'Admin'),
              role: 'admin',
              avatarUrl: (u.user_metadata?.avatar_url as string) ?? '',
            },
            token: data.session.access_token,
            expiresAt: (data.session.expires_at ?? 0) * 1000,
          };
          return session;
        }
      } catch (err) {
        console.warn('[auth] Supabase getSession failed, using local session', err);
      }
    }
    return readSession();
  },

  async login(email: string, password: string): Promise<Session> {
    if (supabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error && data.session) {
        const u = data.session.user;
        const session: Session = {
          user: {
            id: u.id,
            email: u.email ?? '',
            name:
              (u.user_metadata?.name as string) ??
              (u.email ? u.email.split('@')[0] : 'Admin'),
            role: 'admin',
            avatarUrl: (u.user_metadata?.avatar_url as string) ?? '',
          },
          token: data.session.access_token,
          expiresAt: (data.session.expires_at ?? 0) * 1000,
        };
        return session;
      }
      // If Supabase auth fails but demo credentials match, allow local fallback
      // so the dashboard is always demonstrable.
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const session = buildDemoSession(email);
        persist(session);
        return session;
      }
      throw new Error(error?.message ?? 'Identifiants invalides.');
    }

    // Local placeholder auth.
    await delay(null, 500);
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const session = buildDemoSession(email);
      persist(session);
      return session;
    }
    throw new Error('Email ou mot de passe incorrect.');
  },

  async logout(): Promise<void> {
    if (supabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[auth] Supabase signOut failed', err);
      }
    }
    persist(null);
  },
};

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
