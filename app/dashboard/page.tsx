const invoices = [
  { client: "John Smith", project: "Website project", amount: "$2,500", due: "Sep 14, 2026", status: "Overdue" },
  { client: "Maya Studio", project: "Brand strategy", amount: "$1,800", due: "Sep 23, 2026", status: "Due soon" },
  { client: "Northline Co.", project: "Monthly retainer", amount: "$1,200", due: "Sep 29, 2026", status: "Upcoming" },
];

export default function DashboardPage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">P</span> PayFlow</div>
        <nav><a className="active" href="/dashboard">Overview</a><a href="/dashboard">Invoices</a><a href="/dashboard">Clients</a><a href="/dashboard">Follow-ups</a></nav>
        <div className="sidebar-bottom"><a href="/dashboard">Settings</a><span className="secure-note">Private workspace</span></div>
      </aside>
      <section className="dashboard-page">
        <header className="dashboard-header"><div><div className="eyebrow">OVERVIEW</div><h1>Payment pulse</h1><p>Keep every invoice moving toward paid.</p></div><button className="primary">+ Add invoice</button></header>
        <div className="dashboard-metrics"><div><span>Outstanding</span><strong>$8,420</strong><small>4 invoices</small></div><div><span>Overdue</span><strong>$3,200</strong><small>2 invoices</small></div><div><span>Due this week</span><strong>$2,720</strong><small>3 invoices</small></div><div><span>Collected</span><strong>$14,850</strong><small>This month</small></div></div>
        <section className="panel"><div className="panel-head"><div><h2>Invoices</h2><p>Demo records — no real client data is stored here yet.</p></div><button className="secondary">Filter</button></div><div className="table">{invoices.map((i)=><div className="table-row" key={i.client}><div className="client"><span className="avatar">{i.client[0]}</span><div><strong>{i.client}</strong><small>{i.project}</small></div></div><span>{i.amount}</span><span>{i.due}</span><span className={i.status==="Overdue"?"status overdue":"status"}>{i.status}</span><button className="follow">Follow up</button></div>)}</div></section>
      </section>
    </main>
  );
}
