import { ChevronRight, Home } from 'lucide-react';
import { findNavBySegment } from '../config/navigation';
import { navigate } from '../utils/router';

interface BreadcrumbsProps {
  segment: string;
}

export default function Breadcrumbs({ segment }: BreadcrumbsProps) {
  const nav = findNavBySegment(segment);
  const isDashboard = segment === 'dashboard';

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Fil d'Ariane">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        Admin
      </button>
      {!isDashboard && nav && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-stone-300 dark:text-stone-600" />
          <span className="font-medium text-stone-700 dark:text-stone-200">
            {nav.label}
          </span>
        </>
      )}
    </nav>
  );
}
