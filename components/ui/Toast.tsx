'use client';

import { X } from 'lucide-react';
import type { ToastItem } from '@/lib/types';

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const LEFT_BORDER: Record<ToastItem['type'], string> = {
  success: 'var(--success)',
  error: 'var(--error)',
  warning: 'var(--warning)',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div
      className="toast-enter"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${LEFT_BORDER[toast.type]}`,
        borderRadius: '14px',
        padding: '12px 16px',
        maxWidth: '320px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          padding: '2px',
          display: 'flex',
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
