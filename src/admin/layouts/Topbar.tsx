import { Menu, Moon, Sun, Bell, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-background-0/90 backdrop-blur-md border-b border-border-strong">
      <div className="flex flex-row items-center justify-between px-4 sm:px-6 py-3 w-full">
        <button onClick={onOpenMobile} className="lg:hidden p-2 rounded-sm text-text-2 hover:bg-background-2">
          <Menu size={20} />
        </button>
        
        {/* Empty div to push items to the right on desktop */}
        <div className="hidden lg:block flex-1" />

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <button onClick={toggleTheme} className="p-2 rounded-sm text-text-3 hover:text-text-1 hover:bg-background-2 transition">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="relative p-2 rounded-sm text-text-3 hover:text-text-1 hover:bg-background-2 transition">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-sm" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border-strong ml-2">
            <div className="w-8 h-8 rounded-sm bg-background-2 flex items-center justify-center">
              <User size={16} className="text-text-2" />
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-text-1 leading-tight">{user?.email}</p>
              <p className="text-xs text-text-3 font-mono">ADMIN</p>
            </div>

            <button onClick={signOut} className="ml-2 p-2 rounded-sm text-text-3 hover:text-accent hover:bg-background-2 transition">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
