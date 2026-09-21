import { currentUser } from "@clerk/nextjs/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

export const dynamic="force-dynamic";

export default async function SettingsPage(){
 const user=await currentUser(); const userId=await requireUserId(); const workspace=await getWorkspaceByClerkUserId(userId);
 const subscription=await db.subscription.findUnique({where:{workspaceId:workspace.id}});
 return <main className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">P</span> PayFlow</div><nav><a href="/dashboard">Overview</a><a href="/dashboard/invoices">Invoices</a><a href="/dashboard/clients">Clients</a><a href="/dashboard/follow-ups">Follow-ups</a></nav><div className="sidebar-bottom"><a className="active" href="/dashboard/settings">Settings</a><span className="secure-note">Private workspace</span></div></aside><section className="dashboard-page"><header className="dashboard-header"><div><div className="eyebrow">SETTINGS</div><h1>Workspace & account.</h1><p>Manage your access, plan, and privacy basics.</p></div><a className="secondary" href="/dashboard">Back to overview</a></header><section className="settings-grid"><div className="panel"><div className="panel-head"><div><h2>Account</h2><p>Your authentication is managed securely by Clerk.</p></div></div><div className="settings-list"><div><span>Email</span><strong>{user?.primaryEmailAddress?.emailAddress??"—"}</strong></div><div><span>Workspace</span><strong>{workspace.id}</strong></div></div></div><div className="panel"><div className="panel-head"><div><h2>Plan</h2><p>Billing foundation is ready for Stripe checkout.</p></div></div><div className="settings-list"><div><span>Current plan</span><strong>{subscription?.plan??"FREE"}</strong></div><div><span>Status</span><strong>{subscription?.status??"Not subscribed"}</strong></div></div><a className="secondary" href="/terms">View terms</a></div><div className="panel"><div className="panel-head"><div><h2>Privacy & security</h2><p>Learn how PayFlow handles account and client data.</p></div></div><div className="settings-links"><a href="/privacy">Privacy notice</a><a href="/security">Security overview</a><a href="/terms">Terms of service</a></div></div></section></section></main>
}
