'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: '10px',
              color: 'var(--text-muted)', transition: 'background 0.12s ease, color 0.12s ease',
            }}
            className="icon-btn"
          >
            <X size={16} />
          </button>
        </div>
        <div>{children}</div>
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
