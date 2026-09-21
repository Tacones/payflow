import { UserButton } from "@clerk/nextjs";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function statusLabel(status: string, dueDate: Date, now: Date) {
  if (status === "PAID") return "Paid";
  if (status === "OVERDUE" || dueDate < now) return "Overdue";
  return "Upcoming";
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const workspace = await getWorkspaceByClerkUserId(userId);
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [invoices, collectedResult] = await Promise.all([
    db.invoice.findMany({
      where: { workspaceId: workspace.id },
      include: { client: true },
      orderBy: { dueDate: "asc" },
      take: 50,
    }),
    db.payment.aggregate({
      _sum: { amountCents: true },
      where: { workspaceId: workspace.id, paidAt: { gte: monthStart } },
    }),
  ]);

  const openInvoices = invoices.filter((invoice) => invoice.status !== "PAID");
  const overdueInvoices = openInvoices.filter((invoice) => invoice.dueDate < now);
  const dueThisWeek = openInvoices.filter(
    (invoice) => invoice.dueDate >= now && invoice.dueDate <= weekEnd
  );
  const outstanding = openInvoices.reduce((sum, invoice) => sum + invoice.amountCents, 0);
  const overdue = overdueInvoices.reduce((sum, invoice) => sum + invoice.amountCents, 0);
  const dueThisWeekAmount = dueThisWeek.reduce((sum, invoice) => sum + invoice.amountCents, 0);
  const collected = collectedResult._sum.amountCents ?? 0;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">P</span> PayFlow</div>
        <nav>
          <a className="active" href="/dashboard">Overview</a>
          <a href="/dashboard">Invoices</a>
          <a href="/dashboard">Clients</a>
          <a href="/dashboard">Follow-ups</a>
        </nav>
        <div className="sidebar-bottom">
          <a href="/dashboard">Settings</a>
          <span className="secure-note">Private workspace</span>
        </div>
      </aside>

      <section className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <div className="eyebrow">OVERVIEW</div>
            <h1>Payment pulse</h1>
            <p>Keep every invoice moving toward paid.</p>
          </div>
          <div className="header-actions">
            <UserButton afterSignOutUrl="/" />
            <a className="primary" href="/dashboard">+ Add invoice</a>
          </div>
        </header>

        <div className="dashboard-metrics">
          <div><span>Outstanding</span><strong>{money(outstanding)}</strong><small>{openInvoices.length} invoices</small></div>
          <div><span>Overdue</span><strong>{money(overdue)}</strong><small>{overdueInvoices.length} invoices</small></div>
          <div><span>Due this week</span><strong>{money(dueThisWeekAmount)}</strong><small>{dueThisWeek.length} invoices</small></div>
          <div><span>Collected</span><strong>{money(collected)}</strong><small>This month</small></div>
        </div>

        <section className="panel">
          <div className="panel-head">
            <div><h2>Invoices</h2><p>Your private workspace data. No demo records.</p></div>
            <span className="secure-note">Private</span>
          </div>
          <div className="table">
            {invoices.length === 0 ? (
              <div className="empty-state"><strong>No invoices yet.</strong><span>Add your first invoice to start tracking payment.</span></div>
            ) : invoices.map((invoice) => {
              const status = statusLabel(invoice.status, invoice.dueDate, now);
              return (
                <div className="table-row" key={invoice.id}>
                  <div className="client">
                    <span className="avatar">{invoice.client.name[0]?.toUpperCase() ?? "C"}</span>
                    <div><strong>{invoice.client.name}</strong><small>{invoice.title}</small></div>
                  </div>
                  <span>{money(invoice.amountCents, invoice.currency)}</span>
                  <span>{invoice.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className={status === "Overdue" ? "status overdue" : "status"}>{status}</span>
                  <button className="follow">Follow up</button>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
