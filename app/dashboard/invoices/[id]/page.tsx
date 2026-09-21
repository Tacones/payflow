import { notFound } from "next/navigation";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

type Params = { params: Promise<{ id: string }> };

function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({ params }: Params) {
  const userId = await requireUserId();
  const workspace = await getWorkspaceByClerkUserId(userId);
  const { id } = await params;
  const invoice = await db.invoice.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      client: true,
      payments: { orderBy: { paidAt: "desc" }, take: 50 },
      followUps: { orderBy: { sentAt: "desc" }, take: 50 },
    },
  });
  if (!invoice) notFound();

  const overdue = invoice.status !== "PAID" && invoice.dueDate < new Date();
  const status = invoice.status === "PAID" ? "Paid" : overdue ? "Overdue" : "Upcoming";

  return <main className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">P</span> PayFlow</div>
      <nav><a href="/dashboard">Overview</a><a className="active" href="/dashboard/invoices">Invoices</a><a href="/dashboard/clients">Clients</a><a href="/dashboard/follow-ups">Follow-ups</a><a href="/dashboard/payments">Payments</a></nav>
      <div className="sidebar-bottom"><a href="/dashboard/settings">Settings</a><span className="secure-note">Private workspace</span></div>
    </aside>
    <section className="dashboard-page">
      <header className="dashboard-header"><div><div className="eyebrow">INVOICE</div><h1>{invoice.title}</h1><p>{invoice.client.name}{invoice.client.company ? " · " + invoice.client.company : ""}</p></div><a className="secondary" href="/dashboard/invoices">Back to invoices</a></header>
      <div className="dashboard-metrics"><div><span>Amount</span><strong>{money(invoice.amountCents, invoice.currency)}</strong><small>{invoice.currency}</small></div><div><span>Status</span><strong>{status}</strong><small>{status === "Paid" ? "Payment recorded" : "Payment pending"}</small></div><div><span>Due date</span><strong>{invoice.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong><small>{invoice.dueDate.toLocaleDateString("en-US", { year: "numeric" })}</small></div><div><span>Follow-ups</span><strong>{invoice.followUps.length}</strong><small>Logged touches</small></div></div>
      <section className="panel"><div className="panel-head"><div><h2>Client</h2><p>Only records belonging to this workspace are shown.</p></div></div><div className="table"><div className="table-row"><div className="client"><span className="avatar">{invoice.client.name[0]?.toUpperCase() ?? "C"}</span><div><strong>{invoice.client.name}</strong><small>{invoice.client.email ?? "No email recorded"}</small></div></div><span>{invoice.client.company ?? "—"}</span></div></div></section>
      <section className="panel"><div className="panel-head"><div><h2>Payment history</h2><p>{invoice.payments.length} payment record{invoice.payments.length === 1 ? "" : "s"}.</p></div></div><div className="table">{invoice.payments.length === 0 ? <div className="empty-state"><strong>No payment recorded.</strong><span>Marking the invoice paid creates a private payment record.</span></div> : invoice.payments.map(payment => <div className="table-row" key={payment.id}><span>{money(payment.amountCents, invoice.currency)}</span><span>{new Date(payment.paidAt).toLocaleString("en-US")}</span><span>{payment.method ?? "manual"}</span><span className="status">Paid</span></div>)}</div></section>
      <section className="panel"><div className="panel-head"><div><h2>Follow-up history</h2><p>Messages logged against this invoice.</p></div></div><div className="table">{invoice.followUps.length === 0 ? <div className="empty-state"><strong>No follow-ups yet.</strong><span>Use the invoice list to log a professional reminder.</span></div> : invoice.followUps.map(item => <div className="table-row" key={item.id}><span>{item.template}</span><span>{new Date(item.sentAt).toLocaleString("en-US")}</span><span>{item.message}</span></div>)}</div></section>
    </section>
  </main>;
}
