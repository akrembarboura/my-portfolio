import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../../utils/cn';

const baseField =
  'w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950/40 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-colors focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 disabled:opacity-60';

interface FieldWrapProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldWrapProps) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-stone-400">{hint}</span>
      ) : null}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(baseField, invalid && 'border-red-400 focus:border-red-400', className)}
      {...props}
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        baseField,
        'min-h-[96px] resize-y',
        invalid && 'border-red-400 focus:border-red-400',
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(baseField, 'cursor-pointer', invalid && 'border-red-400', className)}
      {...props}
    >
      {children}
    </select>
  );
}
