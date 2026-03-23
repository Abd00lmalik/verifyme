'use client';

interface DividerProps {
  label?: string;
  className?: string;
  my?: string;
}

export function Divider({ label, className = '', my = '16px' }: DividerProps) {
  if (label) {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: `${my} 0` }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
      </div>
    );
  }
  return (
    <div
      className={className}
      style={{ height: '1px', background: 'var(--border-subtle)', margin: `${my} 0` }}
    />
  );
}
