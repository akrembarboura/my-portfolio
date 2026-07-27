import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  onOpenMobile: () => void;
}

export default function Topbar({ onOpenMobile }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  // Use display name before @ in email as a friendly greeting
  const displayName = user?.email?.split('@')[0] ?? 'Admin';
  // Capitalise first letter
  const greeting = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">

        {/* Left: hamburger + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Menu size={20} />
          </button>
          <nav className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Akrem</span>
            <span>/</span>
            <span>Dashboard</span>
          </nav>
        </div>

        {/* Right: theme toggle + user */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow shadow-indigo-500/20">
              <User size={15} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                {greeting}
              </p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 transition"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
