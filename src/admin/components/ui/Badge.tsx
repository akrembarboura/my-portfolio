import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Tone =
  | 'gold'
  | 'green'
  | 'blue'
  | 'gray'
  | 'red'
  | 'amber'
  | 'purple';

const tones: Record<Tone, string> = {
  gold: 'bg-gold-100 text-gold-800 dark:bg-gold-500/15 dark:text-gold-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  gray: 'bg-stone-100 text-stone-600 dark:bg-stone-700/40 dark:text-stone-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({ tone = 'gray', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
