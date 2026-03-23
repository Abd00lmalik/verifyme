'use client';

import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
