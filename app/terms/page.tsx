export const metadata = {
  title: "Terms of Service — PayFlow",
  description: "PayFlow terms of service.",
};

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <article className="legal-card">
        <div className="eyebrow">PAYFLOW</div>
        <h1>Terms of Service</h1>
        <p className="legal-lead">These terms are a framework for the PayFlow service and must be finalized for the operating entity and markets where PayFlow is offered.</p>

        <h2>1. The service</h2>
        <p>PayFlow provides tools for recording invoices, organizing client information, sending or preparing payment follow-ups, recording payments and viewing account activity. PayFlow does not itself guarantee that an invoice will be paid.</p>

        <h2>2. Your account</h2>
        <p>You are responsible for keeping your authentication credentials secure and for the accuracy and lawful use of information entered into your workspace. Do not use PayFlow to store information that the service is not designed to handle.</p>

        <h2>3. Customer responsibilities</h2>
        <p>You remain responsible for your relationships with your clients, the invoices you issue, the messages you send and the legal basis for processing personal information you provide to PayFlow.</p>

        <h2>4. Payments and subscriptions</h2>
        <p>If paid plans are offered, pricing, billing periods, renewal, cancellation, refunds and taxes will be presented at checkout and governed by the final commercial terms applicable to the selected plan.</p>

        <h2>5. Acceptable use</h2>
        <p>You may not use PayFlow for unlawful activity, unauthorized access, abuse of the service, malicious code, fraud or attempts to interfere with another customer's workspace.</p>

        <h2>6. Availability and changes</h2>
        <p>We may maintain, improve or modify the service. We will use reasonable care to preserve customer data and service availability, but no online service can promise uninterrupted operation.</p>

        <h2>7. Liability</h2>
        <p>The final limitation-of-liability, warranty, indemnity and dispute-resolution provisions must be tailored to the operating entity and applicable law before launch.</p>

        <div className="legal-notice"><strong>Launch note:</strong> This is a structured commercial draft, not legal advice. Final terms should be reviewed and approved for the jurisdictions in which PayFlow will sell subscriptions.</div>

        <a className="secondary" href="/">← Back to PayFlow</a>
      </article>
    </main>
  );
}
