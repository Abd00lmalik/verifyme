'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'standard' | 'elevated' | 'interactive';
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, variant = 'standard', padding = '20px', className = '', style }: CardProps) {
  const styles: Record<string, React.CSSProperties> = {
    standard: { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' },
    elevated: { background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' },
    interactive: { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' },
  };

  return (
    <div
      className={`${variant === 'interactive' ? 'interactive-card' : ''} ${className}`}
      style={{ ...styles[variant], borderRadius: '14px', padding, ...style }}
    >
      {children}
    </div>
  );
}
