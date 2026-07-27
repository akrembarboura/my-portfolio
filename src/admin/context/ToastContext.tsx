import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Toast, ToastType } from '../types';

export type { ToastType };

export interface ToastContextValue {
  toasts: Toast[];
  dismiss: (id: string) => void;
  toast: (message: string, type?: ToastType) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  addToast: (t: { title?: string; message: string; description?: string; type?: ToastType }) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, description, type = 'success' }: { title?: string; message: string; description?: string; type?: ToastType }) => {
      const id = Math.random().toString(36).slice(2);
      const newToast: Toast = { id, title: title || message, message, description, type };
      setToasts((t) => [...t, newToast]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      addToast({ message, type });
    },
    [addToast]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      addToast({ title, message: title, description, type: 'success' });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      addToast({ title, message: title, description, type: 'error' });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      addToast({ title, message: title, description, type: 'info' });
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      addToast({ title, message: title, description, type: 'warning' });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, dismiss, toast, success, error, info, warning, addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

