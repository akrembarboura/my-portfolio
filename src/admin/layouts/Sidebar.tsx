import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Image as ImageIcon,
  Images,
  Settings,
  FileText,
  User,
  Users,
  Code2,
  X,
  MessageSquare,
  Briefcase,
  Star,
  Inbox,
  Search
} from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/contacts', label: 'Messages', icon: Inbox },
  { to: '/admin/seo', label: 'SEO Settings', icon: Search },
  { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { to: '/admin/settings', label: 'Global Settings', icon: Settings },
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
          className="fixed inset-0 bg-bg-0/80 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-4 left-0 z-40 h-screen lg:h-[calc(100vh-2rem)] w-[280px] bg-background-1 border-r lg:border border-border-strong lg:m-4 lg:rounded-sm flex flex-col shadow-sm transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-border-strong">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-text-1 flex items-center justify-center flex-shrink-0">
              <Code2 size={20} className="text-background-0" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-1 leading-tight tracking-tight">
                Akrem<span className="text-accent">.</span>
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-text-3 font-semibold mt-1">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-sm text-text-3 hover:bg-background-2 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-text-1 text-background-0'
                  : 'text-text-2 hover:bg-background-2 hover:text-text-1'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-strong">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-text-3 hover:text-accent transition"
          >
            ← Back to portfolio
          </a>
        </div>
      </aside>
    </>
  );
}
