import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-stone-800 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700">
        <Icon className="h-6 w-6 text-gold-500" />
      </div>
      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
