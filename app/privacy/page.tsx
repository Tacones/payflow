export const metadata = {
  title: "Privacy Policy — PayFlow",
  description: "PayFlow privacy information.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <article className="legal-card">
        <div className="eyebrow">PAYFLOW</div>
        <h1>Privacy Policy</h1>
        <p className="legal-lead">PayFlow is designed to help freelancers and solo service businesses manage invoices and payment follow-ups while keeping customer data separated by account.</p>

        <h2>1. Information we handle</h2>
        <p>Depending on how you use PayFlow, we may process account information, such as your name and email address, and workspace information you enter, such as client names, client contact details, invoice descriptions, amounts, due dates, follow-up messages and payment records.</p>

        <h2>2. Why we use it</h2>
        <p>We use this information to authenticate your account, provide the PayFlow service, maintain your private workspace, display invoice and payment history, support billing, protect the service and respond to support requests.</p>

        <h2>3. Account separation</h2>
        <p>Each customer account is associated with its own workspace. Application requests derive the workspace from the authenticated account rather than trusting workspace identifiers supplied by the browser.</p>

        <h2>4. Service providers</h2>
        <p>PayFlow may use specialized infrastructure and service providers for authentication, hosting, databases, email and payment processing. Where providers are used, access should be limited to what is necessary for the service and governed by appropriate contractual and security controls.</p>

        <h2>5. Security</h2>
        <p>We use technical and administrative measures appropriate to the service, including authenticated access, server-side authorization and workspace-level data isolation. No internet service can guarantee absolute security.</p>

        <h2>6. Your rights</h2>
        <p>Applicable privacy laws may give individuals rights concerning access, correction, deletion and other forms of control over their personal information. Requests should be made through the support or privacy contact published by PayFlow.</p>

        <h2>7. Retention and deletion</h2>
        <p>We intend to retain information only for as long as reasonably necessary to provide the service, comply with applicable obligations, resolve disputes and enforce agreements. Product retention and account-deletion controls will be applied before public launch.</p>

        <h2>8. Changes</h2>
        <p>We may update this policy as PayFlow evolves. The effective date shown with the published policy should be reviewed whenever material changes are made.</p>

        <div className="legal-notice"><strong>Launch note:</strong> This document is a product-ready privacy framework, not legal advice. Before accepting paying customers, the operator should insert the final legal entity, privacy contact, retention periods and applicable jurisdiction-specific terms after legal review.</div>

        <a className="secondary" href="/">← Back to PayFlow</a>
      </article>
    </main>
  );
}
