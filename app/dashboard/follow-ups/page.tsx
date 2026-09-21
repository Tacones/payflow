import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceByClerkUserId } from "@/lib/workspace";

export const dynamic="force-dynamic";

export default async function FollowUpsPage(){
 const userId=await requireUserId(); const workspace=await getWorkspaceByClerkUserId(userId);
 const items=await db.followUp.findMany({where:{workspaceId:workspace.id},include:{invoice:{include:{client:true}}},orderBy:{sentAt:"desc"},take:100});
 return <main className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">P</span> PayFlow</div><nav><a href="/dashboard">Overview</a><a href="/dashboard/invoices">Invoices</a><a href="/dashboard/clients">Clients</a><a className="active" href="/dashboard/follow-ups">Follow-ups</a></nav><div className="sidebar-bottom"><a href="/dashboard/settings">Settings</a><span className="secure-note">Private workspace</span></div></aside><section className="dashboard-page"><header className="dashboard-header"><div><div className="eyebrow">FOLLOW-UPS</div><h1>Every touch, accounted for.</h1><p>A private history of the payment conversations you logged.</p></div><a className="secondary" href="/dashboard/invoices">Create a follow-up</a></header><section className="panel"><div className="table">{items.length===0?<div className="empty-state"><strong>No follow-ups yet.</strong><span>Open an invoice and send a follow-up when payment needs a nudge.</span></div>:items.map(item=><div className="table-row" key={item.id}><div className="client"><span className="avatar">{item.invoice.client.name[0]?.toUpperCase()??"C"}</span><div><strong>{item.invoice.client.name}</strong><small>{item.invoice.title}</small></div></div><span>{item.template}</span><span>{new Date(item.sentAt).toLocaleDateString("en-US")}</span><span className="status">Logged</span></div>)}</div></section></section></main>
}
