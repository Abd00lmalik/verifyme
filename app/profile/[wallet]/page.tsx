'use client';

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PlatformGrid } from '@/components/verification/PlatformGrid';
import { ProofBadge } from '@/components/verification/ProofBadge';
import { OnchainRecord } from '@/components/verification/OnchainRecord';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { generateAvatarColor, formatDate } from '@/lib/utils';
import { MOCK_WALLET } from '@/lib/mock-data';
import type { ProofRecord, VerificationState, Platform } from '@/lib/types';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const PLATFORMS: Platform[] = ['github', 'discord', 'farcaster'];

interface PageProps {
  params: { wallet: string };
}

export default function ProfilePage({ params }: PageProps) {
  const rawWallet = params.wallet;
  const wallet = rawWallet === 'demo' ? MOCK_WALLET : rawWallet;

  const [proofs, setProofs] = useState<ProofRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { copy: copyUrl, copied: urlCopied } = useCopyToClipboard();
  const { copy: copyEmbed, copied: embedCopied } = useCopyToClipboard();

  useEffect(() => {
    fetch(`/api/proof?wallet=${wallet}`)
      .then((r) => r.json())
      .then((data) => setProofs(data.proofs || []))
      .catch(() => setProofs([]))
      .finally(() => setIsLoading(false));
  }, [wallet]);

  const verifications: VerificationState[] = PLATFORMS.map((platform) => {
    const proof = proofs.find((p) => p.platform === platform);
    return proof
      ? { platform, status: 'verified' as const, proof }
      : { platform, status: 'unverified' as const };
  });

  const verifiedCount = verifications.filter((v) => v.status === 'verified').length;
  const avatarColor = generateAvatarColor(wallet);
  const profileUrl = `${APP_URL}/profile/${wallet}`;
  const embedCode = `<iframe src="${APP_URL}/badge/${wallet}" width="340" height="120" frameborder="0"></iframe>`;

  // Date joined: earliest verifiedAt
  const joinDate = proofs.length > 0
    ? formatDate(proofs.sort((a, b) => new Date(a.verifiedAt).getTime() - new Date(b.verifiedAt).getTime())[0].verifiedAt)
    : 'â€”';

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px 60px' }}>
      {/* Profile header card */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: '20px', padding: '24px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: avatarColor, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px', fontWeight: 600, color: '#fff',
            flexShrink: 0,
          }}>
            {wallet[0].toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <AddressDisplay address={wallet} startChars={8} endChars={6} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: 'var(--success)', fontSize: '10px' }}>â—</span>
              Rialo Devnet
            </p>
          </div>
        </div>

        {/* Stats pills */}
        <div style={{
          display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap',
        }}>
          {[
            { value: verifiedCount, label: 'Platforms' },
            { value: proofs.length, label: 'Proofs' },
            { value: joinDate, label: 'Joined' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: '10px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '2px',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{stat.value}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified identities */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
            Verified Identities
          </p>
          <span style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: 'var(--text-muted)',
          }}>
            {verifiedCount} / 3
          </span>
        </div>
        {isLoading ? (
          <div style={{ padding: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : (
          <PlatformGrid
            verifications={verifications}
            wallet={wallet}
            readOnly
          />
        )}
      </div>

      {/* On-chain record */}
      {proofs.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <OnchainRecord wallet={wallet} proofs={proofs} />
        </div>
      )}

      {/* Share section */}
      <div>
        <ProofBadge wallet={wallet} verifications={verifications} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => copyUrl(profileUrl)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              height: '38px', padding: '0 16px', borderRadius: '10px',
              background: 'transparent', color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'inherit',
              transition: 'color 0.12s ease, background 0.12s ease, border-color 0.12s ease',
            }}
            className="btn-ghost"
          >
            {urlCopied ? <Check size={13} /> : <Copy size={13} />}
            {urlCopied ? 'Copied!' : 'Copy profile URL'}
          </button>
          <button
            onClick={() => copyEmbed(embedCode)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              height: '38px', padding: '0 16px', borderRadius: '10px',
              background: 'transparent', color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'inherit',
              transition: 'color 0.12s ease, background 0.12s ease, border-color 0.12s ease',
            }}
            className="btn-ghost"
          >
            {embedCopied ? <Check size={13} /> : <Copy size={13} />}
            {embedCopied ? 'Copied!' : 'Copy embed code'}
          </button>
        </div>
      </div>
    </div>
  );
}

