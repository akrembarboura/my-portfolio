import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Image as ImageIcon,
  Settings,
  FileText,
  User,
  Code2,
  X,
  MessageSquare,
} from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero Section', icon: ImageIcon },
  { to: '/admin/about', label: 'About Page', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/leads', label: 'Contact Leads', icon: MessageSquare },
  { to: '/admin/seo', label: 'SEO', icon: FileText },
  { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-4 left-0 z-40 h-screen lg:h-[calc(100vh-2rem)] w-[280px] bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl border-r lg:border border-slate-200 dark:border-slate-700/60 lg:m-4 lg:rounded-2xl flex flex-col shadow-xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <Code2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
                Akrem<span className="text-indigo-500">.</span>
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-400 font-medium">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700/60">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-500 transition"
          >
            ← Back to portfolio
          </a>
        </div>
      </aside>
    </>
  );
}
