'use client';

import { ReactNode } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger-ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const heights: Record<string, string> = { sm: '32px', md: '38px', lg: '42px' };
  const paddings: Record<string, string> = { sm: '10px', md: '16px', lg: '20px' };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: heights[size],
    padding: `0 ${paddings[size]}`,
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'color 0.12s ease, background 0.12s ease, border-color 0.12s ease',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--text-inverse)',
      border: '1px solid transparent',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-default)',
    },
    'danger-ghost': {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-default)',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-${variant} ${className}`}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {loading ? <Spinner size={14} /> : null}
      {children}
    </button>
  );
}
