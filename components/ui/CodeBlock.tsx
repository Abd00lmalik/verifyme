'use client';

import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CodeBlockProps {
  title?: string;
  code: string;
  language?: string;
}

export function CodeBlock({ title, code }: CodeBlockProps) {
  const { copy, copied } = useCopyToClipboard();
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: '10px', overflow: 'hidden' }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--bg-elevated)',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
            {title}
          </span>
          <button
            onClick={() => copy(code)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              color: copied ? 'var(--success)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', transition: 'color 0.12s ease',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre style={{
        background: 'var(--bg-base)',
        padding: '12px 16px',
        margin: 0,
        fontSize: '12px',
        fontFamily: 'monospace',
        color: 'var(--text-secondary)',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        lineHeight: 1.6,
      }}>
        {code}
      </pre>
    </div>
  );
}
