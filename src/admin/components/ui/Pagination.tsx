import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: PaginationProps) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {from}–{to} sur {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={!canPrev}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Précédent
        </Button>
        <span className="px-2 text-sm text-stone-500 dark:text-stone-400">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canNext}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
