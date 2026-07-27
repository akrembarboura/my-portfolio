import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Info, MessageSquare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import type { Notification } from '../types';
import { notificationsService } from '../services/content';
import { supabase } from '../../supabaseClient';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

const iconByType: Record<'info' | 'success' | 'warning' | 'message', { icon: LucideIcon; color: string }> = {
  info: { icon: Info, color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/15' },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/15',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500 bg-amber-100 dark:bg-amber-500/15',
  },
  message: {
    icon: MessageSquare,
    color: 'text-gold-600 bg-gold-100 dark:bg-gold-500/15',
  },
};

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);


  const handleItemClick = (n: Notification) => {
    setOpen(false);
    if (!n.read) {
      notificationsService.markAsRead(n.id).then(setItems).catch(console.error);
    }
  };

  useEffect(() => {
    notificationsService.list().then(setItems);

    const channel = supabase.channel('leads-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        notificationsService.list().then(setItems);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const next = await notificationsService.markAllRead();
    setItems(next);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl border border-stone-200 dark:border-stone-700 p-2.5 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl animate-admin-up">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-4 py-3">
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Notifications
            </p>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-medium text-gold-600 hover:text-gold-700"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="admin-scroll max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-stone-400">
                Aucune notification
              </p>
            ) : (
              items.map((n) => {
                const itemType = (n.type as keyof typeof iconByType) || 'info';
                const { icon: Icon, color } = iconByType[itemType] ?? iconByType.info;
                return (
                  <Link
                    to="/admin/leads"
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={cn(
                      'block w-full text-left flex gap-3 px-4 py-3 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer focus:outline-none focus:bg-stone-50 dark:focus:bg-stone-800/40 active:bg-stone-100 dark:active:bg-stone-800',
                      !n.read && 'bg-gold-50/40 dark:bg-gold-500/5'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                        color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {n.title}
                      </p>
                      <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                        {n.description || n.message}
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone-400">
                        {relativeTime(n.time || n.created_at || new Date().toISOString())}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
