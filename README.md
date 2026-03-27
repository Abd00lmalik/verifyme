# VerifyMe - Decentralized Social Proof Registry on Rialo

A Next.js 14 dApp for linking GitHub, Discord, and Farcaster identities to your Solana wallet. Proof hashes are stored on the Rialo blockchain. No personal data on-chain - only cryptographic fingerprints.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in GitHub + Discord OAuth credentials
npm run dev
```

Visit http://localhost:3000

## Demo

Visit http://localhost:3000/profile/demo to see a fully populated profile with all 3 platforms verified.

## OAuth Setup

### GitHub
1. Go to github.com/settings/developers -> OAuth Apps -> New OAuth App
2. Homepage URL: http://localhost:3000
3. Callback URL: http://localhost:3000/api/github/callback
4. Copy Client ID + Client Secret into `.env.local`

### Discord
1. Go to discord.com/developers/applications -> New Application
2. Add OAuth2 redirect: http://localhost:3000/api/discord/callback
3. Copy Client ID + Client Secret into `.env.local`

### Farcaster
No API keys needed. Uses Sign In With Farcaster (wallet-based auth).

## Wallet Proof Requirement
Users must sign a wallet message before any proof is saved. This prevents someone from claiming a wallet they do not control.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS v3
- @solana/wallet-adapter (Phantom + Backpack + Solflare)
- @farcaster/auth-kit
- Rialo blockchain (SVM-compatible devnet)

## Blockchain Integration
All contract calls are stubbed with TODOs. The current `/api/proof` storage uses Redis and can be swapped for on-chain reads/writes when Rialo devnet access is available.

## Project Structure
```
app/                    Next.js App Router pages + API routes
components/
  layout/               Navbar, Footer
  ui/                   Design system components
  wallet/               Solana wallet adapter wrappers
  verification/         Core verification components
  landing/              Landing page sections
lib/                    Types, utilities, constants, mock data
hooks/                  Custom React hooks
```

