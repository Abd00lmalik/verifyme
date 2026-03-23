'use client';

import { VerificationCard } from './VerificationCard';
import type { Platform, VerificationState } from '@/lib/types';

interface PlatformGridProps {
  verifications: VerificationState[];
  wallet: string;
  readOnly?: boolean;
  onRevoke?: (platform: Platform) => Promise<void>;
  onConnect?: (platform: Platform) => void;
}

export function PlatformGrid({ verifications, wallet, readOnly, onRevoke, onConnect }: PlatformGridProps) {
  return (
    <div>
      {verifications.map((v) => (
        <VerificationCard
          key={v.platform}
          state={v}
          wallet={wallet}
          readOnly={readOnly}
          onRevoke={onRevoke}
          onConnect={onConnect}
        />
      ))}
    </div>
  );
}
