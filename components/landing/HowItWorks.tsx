"use client";

const STEPS = [
  {
    num: "01",
    title: "Connect your wallet",
    body: "Your wallet is your public identity. No email, no password, no real name.",
  },
  {
    num: "02",
    title: "Link your socials",
    body: "Sign in to GitHub or Discord (OAuth) and Farcaster (wallet-based). We read a stable account ID and public counts.",
  },
  {
    num: "03",
    title: "Generate proof hashes",
    body: "We create a 64-character proof hash from (wallet + platform + platform ID). This is the receipt that the link exists.",
  },
  {
    num: "04",
    title: "Share + (soon) anchor on Rialo",
    body: "You get a public profile and a VM Card you can post on X. Next: anchor a single root hash on Rialo so DAOs can verify without trusting our server.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px 80px" }}>
      <div style={{ maxWidth: "560px" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "8px" }}>
          Process
        </p>
        <h2 style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text-primary)", marginBottom: "32px" }}>
          Four steps
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ display: "flex", gap: "20px", position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "32px", flexShrink: 0 }}>
                <span style={{ fontSize: "13px", fontFamily: "monospace", color: "var(--text-muted)", fontWeight: 400 }}>
                  {step.num}
                </span>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, width: "1px", background: "var(--border-subtle)", margin: "8px 0" }} />
                )}
              </div>

              <div style={{ paddingBottom: i < STEPS.length - 1 ? "28px" : "0", flex: 1 }}>
                <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: "6px" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
