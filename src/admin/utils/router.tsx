/**
 * Minimal path-based router for the admin area — no external dependency.
 * All admin routes live under /admin. Navigation uses the History API and a
 * `popstate`/custom event so components can subscribe to the current path.
 */
import { useEffect, useState } from 'react';

const CHANGE_EVENT = 'admin:navigate';

export function navigate(to: string): void {
  const path = to.startsWith('/') ? to : `/${to}`;
  if (window.location.pathname === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function usePathname(): string {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    window.addEventListener(CHANGE_EVENT, handler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener(CHANGE_EVENT, handler);
    };
  }, []);

  return path;
}

/** The admin route slug after /admin (e.g. "/admin/services" -> "services"). */
export function getAdminSegment(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  const rest = clean.replace(/^\/admin/, '').replace(/^\//, '');
  return rest || 'dashboard';
}
