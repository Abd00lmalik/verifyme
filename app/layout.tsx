import type { Metadata } from 'next';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import WalletProvider from '@/components/wallet/WalletProvider';
import { WalletModal } from '@/components/wallet/WalletModal';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'VerifyMe — Decentralized Identity on Rialo',
  description: 'Link your GitHub, Discord, and Farcaster accounts to your wallet. Permanent, cryptographic proof on the Rialo blockchain.',
  icons: { icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✓</text></svg>' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <WalletProvider>
          <Navbar />
          <WalletModal />
          <main style={{ minHeight: '100vh' }}>{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}