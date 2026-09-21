import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    notFound();
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const activeSince = new Date(now);
  activeSince.setDate(activeSince.getDate() - 30);

  const client = await clerkClient();
  const [
    usersResult,
    workspaceCount,
    newWorkspaceCount,
    activeWorkspaceCount,
    invoiceCount,
    clientCount,
    overdueResult,
  ] = await Promise.all([
    client.users.getUserList({ limit: 10, orderBy: "-created_at" }),
    db.workspace.count(),
    db.workspace.count({ where: { createdAt: { gte: monthStart } } }),
    db.workspace.count({ where: { updatedAt: { gte: activeSince } } }),
    db.invoice.count(),
    db.client.count(),
    db.invoice.aggregate({
      _sum: { amountCents: true },
      where: { status: { not: "PAID" }, dueDate: { lt: now } },
    }),
  ]);

  const recentUserIds = usersResult.data.map((user) => user.id);
  const recentWorkspaces = recentUserIds.length
    ? await db.workspace.findMany({
        where: { clerkUserId: { in: recentUserIds } },
        select: { clerkUserId: true, createdAt: true },
      })
    : [];

  const workspaceByUserId = new Map(
    recentWorkspaces.map((workspace) => [workspace.clerkUserId, workspace])
  );

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <div className="eyebrow">PAYFLOW CONTROL CENTER</div>
          <h1>Operations</h1>
          <p>Monitor growth and product activity without entering customer workspaces.</p>
        </div>
        <a className="secondary" href="/dashboard">Back to app</a>
      </header>

      <section className="admin-metrics">
        <article><span>Total users</span><strong>{usersResult.totalCount}</strong><small>Clerk accounts</small></article>
        <article><span>Workspaces</span><strong>{workspaceCount}</strong><small>Private customer areas</small></article>
        <article><span>New this month</span><strong>{newWorkspaceCount}</strong><small>New workspaces</small></article>
        <article><span>Active · 30 days</span><strong>{activeWorkspaceCount}</strong><small>Recently updated</small></article>
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <div className="admin-card-head">
            <div><h2>Product activity</h2><p>Operational totals across isolated workspaces.</p></div>
          </div>
          <div className="admin-stats">
            <div><span>Clients</span><strong>{clientCount}</strong></div>
            <div><span>Invoices</span><strong>{invoiceCount}</strong></div>
            <div><span>Overdue value</span><strong>{money(overdueResult._sum.amountCents ?? 0)}</strong></div>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <div><h2>Billing</h2><p>Stripe billing will populate this area once connected.</p></div>
          </div>
          <div className="billing-placeholder">
            <strong>Ready for Stripe</strong>
            <span>Customer, plan, subscription status and recurring revenue will be tracked here.</span>
          </div>
        </article>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <div><h2>Recent users</h2><p>Identity stays in Clerk; customer financial data stays inside each private workspace.</p></div>
        </div>
        <div className="admin-users">
          {usersResult.data.map((user) => {
            const workspace = workspaceByUserId.get(user.id);
            const email = user.primaryEmailAddress?.emailAddress ?? "No primary email";
            const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unnamed user";

            return (
              <div className="admin-user-row" key={user.id}>
                <div className="admin-user-avatar">{name[0]?.toUpperCase() ?? "U"}</div>
                <div className="admin-user-main">
                  <strong>{name}</strong>
                  <span>{email}</span>
                </div>
                <div className="admin-user-meta">
                  <span>{workspace ? "Workspace active" : "Account created"}</span>
                  <small>{formatDate(workspace?.createdAt ?? user.createdAt)}</small>
                </div>
              </div>
            );
          })}
          {usersResult.data.length === 0 && <div className="admin-empty">No users yet.</div>}
        </div>
      </section>
    </main>
  );
}
