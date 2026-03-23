import type { ProofRecord } from './types';

export const MOCK_WALLET =
  '7xKmW3RqPbN9eDfTvL2sY6hJcA4mX8uZ1nQrV5wE3pk';

export const MOCK_PROOFS: ProofRecord[] = [
  {
    platform: 'github',
    maskedUsername: 'ab****23',
    repoCount: 47,
    verifiedAt: '2025-03-15T14:32:07Z',
    proofHash: '3f7a8b2c9d1e4f6a0b2c3d4e5f6a7b8c',
    wallet: MOCK_WALLET,
    usernameHash: 'c8f2e4b1a3d9f2e07a3d9f2ec8f2e4b1',
    txSignature: '4xKm2W9pQrV5wE3pkN9eDfTvL2sY6hJc',
  },
  {
    platform: 'discord',
    maskedUsername: 'cr****er',
    verifiedAt: '2025-03-16T09:12:44Z',
    proofHash: '8b2cf7a14e9d2c3bd1f6a8b2cf7a14e9',
    wallet: MOCK_WALLET,
    usernameHash: 'd9e3f2a48b1c7e5dd9e3f2a48b1c7e5d',
  },
  {
    platform: 'farcaster',
    maskedUsername: 'bu****er',
    followerCount: 892,
    verifiedAt: '2025-03-17T11:05:22Z',
    proofHash: 'e4d12b8f7c3a9e1de4d12b8f7c3a9e1d',
    wallet: MOCK_WALLET,
    usernameHash: 'f2a4c8e19b7d3f6af2a4c8e19b7d3f6a',
  },
];
