"use client";

import { FormEvent, useEffect, useState } from "react";

type Client={id:string;name:string;email?:string|null};
type Invoice={id:string;title:string;amountCents:number;currency:string;dueDate:string;status:string;client:Client};

const money=(c:number,cur="USD")=>new Intl.NumberFormat("en-US",{style:"currency",currency:cur}).format(c/100);

export default function InvoicesPage(){
  const [clients,setClients]=useState<Client[]>([]);
  const [invoices,setInvoices]=useState<Invoice[]>([]);
  const [message,setMessage]=useState("");
  async function load(){
    const [c,i]=await Promise.all([fetch("/api/clients"),fetch("/api/invoices")]);
    if(c.ok)setClients((await c.json()).clients);
    if(i.ok)setInvoices((await i.json()).invoices);
  }
  useEffect(()=>{load()},[]);
  async function create(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setMessage("");
    const f=new FormData(e.currentTarget);
    const amount=Math.round(Number(f.get("amount"))*100);
    const r=await fetch("/api/invoices",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:f.get("clientId"),title:f.get("title"),amountCents:amount,dueDate:f.get("dueDate"),currency:"USD"})});
    if(!r.ok){setMessage("Please check the invoice details.");return}
    e.currentTarget.reset(); setMessage("Invoice created."); await load();
  }
  async function action(id:string,path:string){
    const r=await fetch("/api/invoices/"+id+"/"+path,{method:"POST",headers:{"Content-Type":"application/json"},body:path==="follow-up"?JSON.stringify({template:"PROFESSIONAL"}):undefined});
    if(r.ok){setMessage(path==="follow-up"?"Follow-up logged.":"Invoice marked paid.");await load()} else setMessage("Action could not be completed.");
  }
  return <main className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">P</span> PayFlow</div><nav><a href="/dashboard">Overview</a><a className="active" href="/dashboard/invoices">Invoices</a><a href="/dashboard/clients">Clients</a><a href="/dashboard/follow-ups">Follow-ups</a></nav><div className="sidebar-bottom"><a href="/dashboard/settings">Settings</a><span className="secure-note">Private workspace</span></div></aside>
  <section className="dashboard-page"><header className="dashboard-header"><div><div className="eyebrow">INVOICES</div><h1>Keep payment moving.</h1><p>Create, track, follow up, and mark paid.</p></div><a className="secondary" href="/dashboard">Back to overview</a></header>
  <section className="panel"><div className="panel-head"><div><h2>New invoice</h2><p>Only your private workspace can access these records.</p></div></div>
  <form className="form-grid" onSubmit={create}><label>Client<select name="clientId" required defaultValue=""><option value="" disabled>Select a client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Invoice title<input name="title" required maxLength={180} placeholder="Website project"/></label><label>Amount (USD)<input name="amount" type="number" min="0.01" step="0.01" required placeholder="2500"/></label><label>Due date<input name="dueDate" type="date" required/></label><button className="primary" type="submit">Create invoice</button>{message&&<span className="form-message">{message}</span>}</form></section>
  <section className="panel"><div className="panel-head"><div><h2>Invoice list</h2><p>{invoices.length} invoice{invoices.length===1?"":"s"} in this workspace.</p></div></div><div className="table">{invoices.length===0?<div className="empty-state"><strong>No invoices yet.</strong><span>Add a client first, then create your first invoice.</span></div>:invoices.map(i=><div className="table-row" key={i.id}><div className="client"><span className="avatar">{i.client.name[0]?.toUpperCase()??"C"}</span><div><strong>{i.client.name}</strong><small>{i.title}</small></div></div><span>{money(i.amountCents,i.currency)}</span><span>{new Date(i.dueDate).toLocaleDateString("en-US")}</span><span className={i.status==="PAID"?"status":"status overdue"}>{i.status==="PAID"?"Paid":"Open"}</span><div className="row-actions">{i.status!=="PAID"&&<><button className="follow" onClick={()=>action(i.id,"follow-up")}>Follow up</button><button className="follow" onClick={()=>action(i.id,"mark-paid")}>Mark paid</button></>}</div></div>)}</div></section>
  </section></main>
}
