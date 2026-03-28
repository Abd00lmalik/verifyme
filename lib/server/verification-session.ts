import { Redis } from "@upstash/redis";
import { randomBytes } from "crypto";
import type { Platform } from "@/lib/types";

const redis = Redis.fromEnv();

const OAUTH_REQUEST_PREFIX = "oauth:request:";
const VERIFIED_SOCIAL_PREFIX = "verify:session:";

const OAUTH_REQUEST_TTL_SECONDS = 10 * 60;
const VERIFIED_SOCIAL_TTL_SECONDS = 10 * 60;

export interface OAuthRequestSession {
  id: string;
  wallet: string;
  platform: Exclude<Platform, "farcaster">;
  issuedAt: string;
}

export interface VerifiedSocialSession {
  id: string;
  wallet: string;
  platform: Platform;
  userId: string;
  username: string;
  proofMethod: string;
  providerSessionId: string;
  issuedAt: string;
  expiresAt: string;
  pfpUrl?: string;
  repoCount?: number;
  commitCount?: number;
  followerCount?: number;
  serverCount?: number;
  accountCreatedAt?: string;
}

function randomToken() {
  return randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function oauthRequestKey(token: string) {
  return `${OAUTH_REQUEST_PREFIX}${token}`;
}

function verifiedSocialKey(token: string) {
  return `${VERIFIED_SOCIAL_PREFIX}${token}`;
}

export async function issueOAuthRequestSession(args: {
  wallet: string;
  platform: Exclude<Platform, "farcaster">;
}) {
  const token = randomToken();
  const payload: OAuthRequestSession = {
    id: token,
    wallet: String(args.wallet).trim(),
    platform: args.platform,
    issuedAt: new Date().toISOString(),
  };

  await redis.set(oauthRequestKey(token), payload, { ex: OAUTH_REQUEST_TTL_SECONDS });
  return payload;
}

export async function consumeOAuthRequestSession(
  token: string,
  expectedPlatform: Exclude<Platform, "farcaster">
): Promise<OAuthRequestSession | null> {
  const key = oauthRequestKey(token);
  const session = await redis.get<OAuthRequestSession>(key);
  if (!session) return null;
  await redis.del(key);

  if (session.platform !== expectedPlatform) return null;
  return session;
}

export async function issueVerifiedSocialSession(args: {
  wallet: string;
  platform: Platform;
  userId: string;
  username: string;
  proofMethod: string;
  providerSessionId: string;
  pfpUrl?: string;
  repoCount?: number;
  commitCount?: number;
  followerCount?: number;
  serverCount?: number;
  accountCreatedAt?: string;
}) {
  const token = randomToken();
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + VERIFIED_SOCIAL_TTL_SECONDS * 1000).toISOString();

  const payload: VerifiedSocialSession = {
    id: token,
    wallet: String(args.wallet).trim(),
    platform: args.platform,
    userId: String(args.userId).trim(),
    username: String(args.username).trim(),
    proofMethod: String(args.proofMethod),
    providerSessionId: String(args.providerSessionId),
    issuedAt,
    expiresAt,
    ...(args.pfpUrl ? { pfpUrl: String(args.pfpUrl) } : {}),
    ...(typeof args.repoCount === "number" ? { repoCount: args.repoCount } : {}),
    ...(typeof args.commitCount === "number" ? { commitCount: args.commitCount } : {}),
    ...(typeof args.followerCount === "number" ? { followerCount: args.followerCount } : {}),
    ...(typeof args.serverCount === "number" ? { serverCount: args.serverCount } : {}),
    ...(args.accountCreatedAt ? { accountCreatedAt: String(args.accountCreatedAt) } : {}),
  };

  await redis.set(verifiedSocialKey(token), payload, { ex: VERIFIED_SOCIAL_TTL_SECONDS });
  return payload;
}

export async function consumeVerifiedSocialSession(args: {
  token: string;
  wallet: string;
  platform: Platform;
}): Promise<VerifiedSocialSession | null> {
  const key = verifiedSocialKey(args.token);
  const session = await redis.get<VerifiedSocialSession>(key);
  if (!session) return null;
  await redis.del(key);

  if (session.wallet !== args.wallet || session.platform !== args.platform) {
    return null;
  }

  return session;
}
