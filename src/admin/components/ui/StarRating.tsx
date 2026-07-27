import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export default function StarRating({
  value,
  onChange,
  size = 18,
  readOnly = false,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(!readOnly && 'cursor-pointer transition-transform hover:scale-110')}
          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={
              star <= value
                ? 'fill-gold-400 text-gold-400'
                : 'fill-transparent text-stone-300 dark:text-stone-600'
            }
          />
        </button>
      ))}
    </div>
  );
}
