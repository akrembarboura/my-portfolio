import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  return (
    <div className="admin-root relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-300/20 blur-3xl dark:bg-gold-500/10" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-stone-300/30 blur-3xl dark:bg-stone-700/20" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-stone-400">Chargement…</p>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-md px-4">{children}</div>
      )}
    </div>
  );
}
