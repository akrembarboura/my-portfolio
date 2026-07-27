import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../utils/router';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (user?.name ?? 'A')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl border border-stone-200 dark:border-stone-700 py-1.5 pl-1.5 pr-2.5 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-xs font-bold text-charcoal-900">
            {initials}
          </span>
        )}
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight text-stone-900 dark:text-stone-100">
            {user?.name}
          </span>
          <span className="block text-xs capitalize text-stone-400">
            {user?.role}
          </span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 shadow-xl animate-admin-up">
          <div className="border-b border-stone-100 dark:border-stone-800 px-3 py-2.5">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
              {user?.name}
            </p>
            <p className="truncate text-xs text-stone-400">{user?.email}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/admin/settings');
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <UserRound className="h-4 w-4" />
              Mon profil
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate('/admin/settings');
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </button>
          </div>
          <div className="border-t border-stone-100 dark:border-stone-800 pt-1">
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
