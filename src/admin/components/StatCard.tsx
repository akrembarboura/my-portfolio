import { type LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

type StatCardTone = 'gold' | 'blue' | 'green' | 'purple' | 'red' | 'amber';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  tone?: StatCardTone;
}

const toneClasses: Record<StatCardTone, string> = {
  gold: 'bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
};

export function StatCard({ label, value, icon: Icon, trend, tone = 'gold' }: StatCardProps) {
  const isPositive = trend ? trend.value >= 0 : false;
  const TrendIcon = trend ? (isPositive ? ArrowUpRight : ArrowDownRight) : null;

  return (
    <Card className="animate-admin-up">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
        </div>
        <div className={cn('rounded-xl p-2', toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <Badge tone={isPositive ? 'green' : 'red'}>
            {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
            {isPositive ? '+' : ''}{trend.value}%{' '}
            <span className="opacity-75">{trend.label}</span>
          </Badge>
        </div>
      )}
    </Card>
  );
}
