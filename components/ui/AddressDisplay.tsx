'use client';

import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { truncateAddress } from '@/lib/utils';

interface AddressDisplayProps {
  address: string;
  startChars?: number;
  endChars?: number;
  className?: string;
}

export function AddressDisplay({ address, startChars = 6, endChars = 4, className = '' }: AddressDisplayProps) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '13px' }}
    >
      {truncateAddress(address, startChars, endChars)}
      <button
        onClick={() => copy(address)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: copied ? 'var(--success)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.12s ease',
        }}
        title="Copy address"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </span>
  );
}
