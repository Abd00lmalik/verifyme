"use client";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { APP_URL } from "@/lib/constants";

function getDomain(appUrl: string) {
  return appUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

const appUrl = APP_URL;
const farcasterConfig = {
  relay: process.env.NEXT_PUBLIC_FARCASTER_RELAY_URL || "https://relay.farcaster.xyz",
  domain: getDomain(appUrl),
  siweUri: `${appUrl}/verify`,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthKitProvider config={farcasterConfig}>{children}</AuthKitProvider>;
}

