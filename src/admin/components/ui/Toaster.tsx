import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import type { ToastType } from '../../context/ToastContext';
import { cn } from '../../utils/cn';

const config: Record<ToastType, { icon: LucideIcon; ring: string; iconColor: string }> = {
  success: {
    icon: CheckCircle2,
    ring: 'ring-emerald-500/20',
    iconColor: 'text-emerald-500',
  },
  error: { icon: XCircle, ring: 'ring-red-500/20', iconColor: 'text-red-500' },
  info: { icon: Info, ring: 'ring-blue-500/20', iconColor: 'text-blue-500' },
  warning: {
    icon: AlertTriangle,
    ring: 'ring-amber-500/20',
    iconColor: 'text-amber-500',
  },
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((t) => {
        const itemConfig = config[t.type] || config.success;
        const Icon = itemConfig.icon;
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-lg ring-1 animate-toast-in',
              itemConfig.ring
            )}
            role="status"
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', itemConfig.iconColor)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {t.title || t.message}
              </p>
              {t.description && (
                <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

