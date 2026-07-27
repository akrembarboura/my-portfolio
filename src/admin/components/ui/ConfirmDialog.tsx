import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  loading,
  onConfirm,
  onCancel,
  destructive = true,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4 pt-2 pb-4">
        <div
          className={
            destructive
              ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15'
              : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600 dark:bg-gold-500/15'
          }
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
}
