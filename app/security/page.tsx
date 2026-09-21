export const metadata = {
  title: "Security — PayFlow",
  description: "PayFlow security approach.",
};

export default function SecurityPage() {
  return (
    <main className="legal-shell">
      <article className="legal-card">
        <div className="eyebrow">PAYFLOW SECURITY</div>
        <h1>Security & data isolation</h1>
        <p className="legal-lead">PayFlow is being engineered around a simple principle: one customer should not be able to access another customer's workspace.</p>

        <h2>Authentication</h2>
        <p>Customer authentication is handled through Clerk. Protected application routes require an authenticated session, and sign-in can support both Google and email/password flows.</p>

        <h2>Workspace isolation</h2>
        <p>Every authenticated customer is mapped to a unique workspace. Database queries are scoped to that workspace on the server. Related records also carry workspace-aware database relationships to strengthen the boundary.</p>

        <h2>Administrative access</h2>
        <p>Administrative access is separate from ordinary customer access and is restricted through a server-side administrator allowlist. The administration area is intended for operational metrics and billing management rather than unrestricted browsing of customer workspaces.</p>

        <h2>Secrets</h2>
        <p>Application secrets are configured through server-side environment variables and are not intended to be committed to source control.</p>

        <h2>Incident response</h2>
        <p>Security incidents will be assessed according to applicable law and the nature and risk of the affected data. Where required, appropriate notifications and mitigation steps will be taken.</p>

        <div className="legal-notice"><strong>Important:</strong> This page describes the current engineering direction. It is not a certification, audit report or guarantee of security.</div>

        <a className="secondary" href="/">← Back to PayFlow</a>
      </article>
    </main>
  );
}
