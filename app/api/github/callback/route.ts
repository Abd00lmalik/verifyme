import { NextRequest, NextResponse } from "next/server";

const APP_URL = "https://verifyme-two.vercel.app";

function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(8, "0").repeat(8).slice(0, 64);
}

function maskUsername(username: string): string {
  if (!username || username.length <= 4) return username;
  return username.slice(0, 2) + "****" + username.slice(-2);
}

async function getCommitCount(login: string, token: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}/events/public?per_page=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "VerifyMe",
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const events = await res.json();
    if (!Array.isArray(events)) return 0;

    let commits = 0;
    for (const ev of events) {
      if (ev?.type === "PushEvent" && Array.isArray(ev?.payload?.commits)) {
        commits += ev.payload.commits.length;
      }
    }
    return commits;
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const wallet = searchParams.get("state") || searchParams.get("wallet") || "unknown";
  const mock = searchParams.get("mock");

  try {
    let login = "mockdev77";
    let id = 123456;
    let publicRepos = 47;
    let commitCount = 130;
    let avatarUrl = "https://avatars.githubusercontent.com/u/9919?v=4";

    if (!mock) {
      if (!code) throw new Error("No code provided");

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GITHUB_REDIRECT_URI || `${APP_URL}/api/github/callback`,
        }),
      });
      const tokenData = await tokenRes.json();
      if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

      const token = String(tokenData.access_token || "");
      if (!token) throw new Error("No GitHub token");

      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "VerifyMe",
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      });
      const user = await userRes.json();

      login = user.login;
      id = user.id;
      publicRepos = Number(user.public_repos || 0);
      avatarUrl = user.avatar_url || `https://avatars.githubusercontent.com/u/${id}?v=4`;
      commitCount = await getCommitCount(login, token);
    }

    const params = new URLSearchParams({
      success: "true",
      platform: "github",
      proofHash: hash(wallet + String(id)),
      usernameHash: hash(login),
      maskedUsername: maskUsername(login),
      pfpUrl: avatarUrl,
      wallet,
      repoCount: String(publicRepos),
      commitCount: String(commitCount),
    });

    return NextResponse.redirect(`${APP_URL}/verify?${params.toString()}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      `${APP_URL}/verify?error=true&platform=github&message=${encodeURIComponent(msg)}`
    );
  }
}
