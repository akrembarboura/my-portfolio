import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const crumbs: Record<string, string> = {
    '/admin': 'Tableau de bord',
    '/admin/services': 'Services',
    '/admin/projects': 'Projets',
    '/admin/portfolio': 'Portfolio',
    '/admin/testimonials': 'Témoignages',
    '/admin/leads': 'Demandes de contact',
    '/admin/hero': 'Section Hero',
    '/admin/about': 'Page À propos',
    '/admin/seo': 'SEO',
    '/admin/media': 'Médiathèque',
    '/admin/settings': 'Paramètres',
  };
  const current = crumbs[location.pathname] ?? 'Admin';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">{current}</span>
          </nav>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
