'use client';

import { useSignIn } from '@farcaster/auth-kit';
import { Spinner } from '@/components/ui/Spinner';

interface FarcasterSignInProps {
  onSuccess: (data: { fid: number; username: string; custody: string; signature: string }) => void;
  onError?: (err: unknown) => void;
}

export default function FarcasterSignIn({ onSuccess, onError }: FarcasterSignInProps) {
  const { signIn, isPolling: isLoading, error } = useSignIn({
    onSuccess: ({ fid, username, custody, signature }: { fid: number; username: string; custody: string; signature: `0x${string}` }) => {
      onSuccess({ fid, username, custody: custody as string, signature: signature as string });
    },
    onError: onError,
  });

  return (
    <button
      onClick={() => signIn()}
      disabled={isLoading}
      style={{
        width: '100%', height: '38px', borderRadius: '10px',
        background: 'var(--accent)', color: 'var(--text-inverse)',
        border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
        fontSize: '14px', fontWeight: 500, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        transition: 'background 0.12s ease', letterSpacing: '-0.01em',
        opacity: isLoading ? 0.8 : 1,
      }}
      className="btn-primary"
    >
      {isLoading ? <Spinner size={14} /> : null}
      {isLoading ? 'Connecting...' : 'Connect Farcaster'}
    </button>
  );
}

