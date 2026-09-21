const metrics = [
  ["Outstanding", "$8,420", "4 invoices"],
  ["Overdue", "$3,200", "2 invoices"],
  ["Due this week", "$2,720", "3 invoices"],
  ["Collected", "$14,850", "This month"],
];

const invoices = [
  { client: "John Smith", project: "Website project", amount: "$2,500", status: "Overdue 6d" },
  { client: "Maya Studio", project: "Brand strategy", amount: "$1,800", status: "Due in 2d" },
  { client: "Northline Co.", project: "Monthly retainer", amount: "$1,200", status: "Due in 8d" },
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <div className="brand"><span className="brand-mark">P</span> PayFlow</div>
        <div className="nav-links"><a href="#product">Product</a><a href="#pricing">Pricing</a><a href="#security">Security</a><a className="ghost" href="/sign-in">Sign in</a><a className="primary" href="/sign-up">Start for free</a></div>
      </nav>

      <section className="hero">
        <div className="eyebrow">PAYMENT FOLLOW-UP, WITHOUT THE FRICTION</div>
        <h1>Get paid without the <span>awkward follow-up.</span></h1>
        <p>PayFlow helps independent professionals keep invoices visible, follow up professionally, and turn outstanding payments into cash flow.</p>
        <div className="hero-actions"><a className="primary large" href="/sign-up">Try PayFlow free</a><button className="secondary large">See how it works <span>→</span></button></div>
        <div className="trust"><span>✓ No credit card required</span><span>✓ Built for solo businesses</span><span>✓ Your client data stays private</span></div>
      </section>

      <section className="product" id="product">
        <div className="section-heading"><div><div className="eyebrow">A CLEARER MONEY WORKFLOW</div><h2>Invoice. Follow up. Get paid.</h2></div><p>Everything you need to stay on top of receivables without turning payment chasing into a full-time job.</p></div>
        <div className="dashboard">
          <div className="dash-top"><div><div className="dash-label">Good morning</div><h3>Your payment pulse</h3></div><button className="primary">+ Add invoice</button></div>
          <div className="metrics">{metrics.map(([label,value,note])=><div className="metric" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
          <div className="invoice-card"><div className="invoice-head"><strong>Recent invoices</strong><button className="text-button">View all →</button></div>{invoices.map(i=><div className="invoice-row" key={i.client}><div className="client"><span className="avatar">{i.client[0]}</span><div><strong>{i.client}</strong><small>{i.project}</small></div></div><strong>{i.amount}</strong><span className={i.status.includes("Overdue") ? "status overdue" : "status"}>{i.status}</span><button className="follow">Follow up</button></div>)}</div>
        </div>
      </section>

      <section className="steps">
        {[["01","Add","Create an invoice record in seconds."],["02","Follow up","Use a professional reminder that feels human."],["03","Get paid","Mark it paid and keep your history organized."]].map(([n,t,d])=><div className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
      </section>

      <section className="security" id="security"><div><div className="eyebrow">PRIVACY BY DESIGN</div><h2>Your client data comes first.</h2><p>PayFlow is being built with account isolation, secure authentication, server-side secrets, and no public exposure of client or invoice records.</p></div><div className="security-badge"><span className="badge-icon">✓</span><div><strong>Account Security</strong><small>Private access · isolated workspace</small></div></div><div className="security-list"><div>✓ Private workspace per account</div><div>✓ No bank credentials stored</div><div>✓ Secrets kept out of source code</div><div>✓ Stripe-ready architecture</div></div></section>

      <footer><div className="brand"><span className="brand-mark">P</span> PayFlow</div><span>© 2026 PayFlow. Built for getting paid.</span></footer>
    </main>
  );
}
