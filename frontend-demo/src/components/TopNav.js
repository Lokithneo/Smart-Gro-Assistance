import React from "react";

export default function TopNav(){
  return (
    <header style={{
      backdropFilter: "saturate(180%) blur(8px)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))",
      borderBottom: "1px solid rgba(15,23,42,0.04)",
      padding: "12px 0",
      position: "sticky",
      top:0,
      zIndex:50
    }}>
      <div className="container flex" style={{justifyContent:"space-between", alignItems:"center"}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <div style={{
            width:42, height:42, borderRadius:10,
            background:"linear-gradient(180deg,#0a84ff,#0066d6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontWeight:700, fontSize:18
          }}>SR</div>
          <div>
            <div style={{fontWeight:700}}>Smart Retail</div>
            <div className="kv">Inventory · Billing · Reports</div>
          </div>
        </div>

        <nav style={{display:"flex", gap:12, alignItems:"center"}}>
          <button className="btn btn-ghost">Dashboard</button>
          <button className="btn btn-ghost">Products</button>
          <button className="btn btn-ghost">Billing</button>
          <button className="btn btn-ghost">Stock</button>
          <button className="btn btn-ghost">Reports</button>
          <button className="btn btn-primary">+ New</button>
        </nav>
      </div>
    </header>
  );
}
