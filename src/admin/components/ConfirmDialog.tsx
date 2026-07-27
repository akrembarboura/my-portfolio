import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Supprimer',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
          <AlertTriangle size={24} className="text-rose-600" />
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="admin-btn-ghost">
              Annuler
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="admin-btn-danger"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
