import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

export const dynamic = "force-dynamic";

function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function PaymentsPage() {
  const userId = await requireUserId();
  const workspace = await getWorkspaceByClerkUserId(userId);
  const payments = await db.payment.findMany({
    where: { workspaceId: workspace.id },
    include: { invoice: { include: { client: true } } },
    orderBy: { paidAt: "desc" },
    take: 100,
  });

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">P</span> PayFlow</div>
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/invoices">Invoices</a>
          <a href="/dashboard/clients">Clients</a>
          <a href="/dashboard/follow-ups">Follow-ups</a>
          <a className="active" href="/dashboard/payments">Payments</a>
        </nav>
        <div className="sidebar-bottom"><a href="/dashboard/settings">Settings</a><span className="secure-note">Private workspace</span></div>
      </aside>
      <section className="dashboard-page">
        <header className="dashboard-header">
          <div><div className="eyebrow">PAYMENTS</div><h1>Money collected.</h1><p>A private history of payments recorded in your workspace.</p></div>
          <a className="secondary" href="/dashboard">Back to overview</a>
        </header>
        <section className="panel">
          <div className="panel-head"><div><h2>Payment history</h2><p>{payments.length} recorded payment{payments.length === 1 ? "" : "s"}.</p></div></div>
          <div className="table">
            {payments.length === 0 ? (
              <div className="empty-state"><strong>No payments yet.</strong><span>When an invoice is marked paid, its payment record appears here.</span></div>
            ) : payments.map((payment) => (
              <div className="table-row" key={payment.id}>
                <div className="client"><span className="avatar">{payment.invoice.client.name[0]?.toUpperCase() ?? "C"}</span><div><strong>{payment.invoice.client.name}</strong><small>{payment.invoice.title}</small></div></div>
                <strong>{money(payment.amountCents, payment.invoice.currency)}</strong>
                <span>{new Date(payment.paidAt).toLocaleDateString("en-US")}</span>
                <span>{payment.method ?? "manual"}</span>
                <span className="status">Paid</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
