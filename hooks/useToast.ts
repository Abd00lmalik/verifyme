'use client';

import { useState, useCallback } from 'react';
import type { ToastItem } from '@/lib/types';

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (type: ToastItem['type'], title: string, message?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
