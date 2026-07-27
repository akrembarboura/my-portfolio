import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface DataTableProps {
  headers: ReactNode[];
  children: ReactNode;
  className?: string;
}

export function DataTable({ headers, children, className }: DataTableProps) {
  return (
    <div
      className={cn(
        'admin-scroll overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900',
        className
      )}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/30">
            {headers.map((header, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/40',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn('px-5 py-3.5 text-stone-700 dark:text-stone-300', className)}>
      {children}
    </td>
  );
}
