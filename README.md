# VerifyMe — Decentralized Social Proof Registry on Rialo

A Next.js 14 dApp for linking GitHub, Discord, and Farcaster identities to your Solana wallet. Proof hashes are stored on the Rialo blockchain. No personal data on-chain — only cryptographic fingerprints.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in GitHub + Discord OAuth credentials (optional — app works in mock mode without them)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Demo

Visit [http://localhost:3000/profile/demo](http://localhost:3000/profile/demo) to see a fully populated profile with all 3 platforms verified.

## OAuth Setup (optional)

### GitHub
1. Go to github.com/settings/developers → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/github/callback`
4. Copy Client ID + Client Secret into `.env.local`

### Discord
1. Go to discord.com/developers/applications → New Application
2. Add OAuth2 redirect: `http://localhost:3000/api/discord/callback`
3. Copy Client ID + Client Secret into `.env.local`

### Farcaster
No API keys needed. Uses Sign In With Farcaster (wallet-based auth).

## Without OAuth credentials
The app runs in **mock mode** automatically — all OAuth flows return mock user data so you can test the full verification flow.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS v3
- @solana/wallet-adapter (Phantom + Backpack)
- @farcaster/auth-kit
- Rialo blockchain (SVM-compatible devnet)

## Blockchain Integration
All contract calls are stubbed with `// TODO: Replace with Rialo contract call when devnet RPC is available` comments. The in-memory proof store (`/api/proof`) will be replaced with on-chain reads/writes.

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
