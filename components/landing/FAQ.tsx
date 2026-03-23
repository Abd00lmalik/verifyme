'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is my personal data stored on-chain?',
    a: 'No. We generate a SHA-256 hash from your wallet address and social account ID. Only that hash is stored on Rialo. Your username, email, and any personal details never touch the blockchain.',
  },
  {
    q: 'What exactly is a proof hash?',
    a: 'It is a unique cryptographic fingerprint created by combining your wallet address with your social account ID. It proves the connection exists without revealing either value in readable form.',
  },
  {
    q: 'Can I remove a verification?',
    a: 'Yes. You can revoke any verification from your dashboard at any time. This removes the on-chain record and clears your proof.',
  },
  {
    q: 'Why Rialo and not Ethereum or Solana?',
    a: 'Rialo has native web connectivity built into the protocol. Our smart contract will call OAuth verification APIs directly — without relying on any third-party oracle service. That is not possible on other chains without expensive middleware.',
  },
  {
    q: 'Is this free?',
    a: 'Connecting and verifying is free. You pay only a small blockchain gas fee to store your proof — fractions of a cent.',
  },
  {
    q: 'What is Farcaster?',
    a: 'Farcaster is a decentralized social network where your identity is controlled by your wallet. Sign In With Farcaster lets you prove your Farcaster identity without any API keys or OAuth credentials.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 80px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: '24px' }}>
        Common questions
      </h2>
      <div>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontFamily: 'inherit',
              }}
              className="faq-btn"
            >
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em', paddingRight: '16px' }}>
                {faq.q}
              </span>
              <ChevronDown
                size={16}
                style={{
                  color: 'var(--text-muted)', flexShrink: 0,
                  transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.12s ease',
                }}
              />
            </button>
            {open === i && (
              <div style={{ paddingBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
