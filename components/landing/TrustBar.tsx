'use client';

export function TrustBar() {
  const items = ['Non-custodial', 'No PII on-chain', 'Open source', 'Zero custody', 'Built on Rialo'];
  return (
    <div style={{
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '16px 24px',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {items.join(' · ')}
      </p>
    </div>
  );
}
