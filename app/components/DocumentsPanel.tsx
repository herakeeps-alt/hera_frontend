"use client";

const docs = [
  { icon: "📄", name: "alloc_riftval_q3.pdf", meta: "ALLOCATION · 2.1 MB · Mar 1, 2025", hash: "QmX4f…3b2c", flagged: false },
  { icon: "🧾", name: "receipt_q2_pump.pdf", meta: "RECEIPT · 450 KB · Feb 28, 2025", hash: "QmB9e…7a44", flagged: false },
  { icon: "⚠", name: "receipt_kiambu_feb.pdf", meta: "HASH MISMATCH · Tamper Alert", hash: "QmD2c…FAIL", flagged: true },
  { icon: "📋", name: "invoice_star_lab.pdf", meta: "INVOICE · 820 KB · Feb 26, 2025", hash: "Qm77a…f11b", flagged: false },
  { icon: "📑", name: "unicef_grant_2025.pdf", meta: "GRANT AGREEMENT · 5.4 MB · Feb 20", hash: "QmZ3d…9c80", flagged: false },
];

export default function DocumentsPanel() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>Off-chain Documents</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)", cursor: "pointer" }}>Browse IPFS →</div>
      </div>
      <div style={{ padding: "10px 20px 6px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", letterSpacing: 1 }}>
          IPFS / CRYPTOGRAPHIC HASH VERIFICATION
        </div>
      </div>
      {docs.map((d, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "11px 20px", borderBottom: i < docs.length - 1 ? "1px solid rgba(30,40,64,0.5)" : "none",
          cursor: "pointer", transition: "background 0.12s",
          borderLeft: d.flagged ? "2px solid var(--red)" : "2px solid transparent",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 28, height: 28, background: "var(--surface2)",
            border: `1px solid ${d.flagged ? "rgba(248,113,113,0.3)" : "var(--border)"}`,
            borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", flexShrink: 0,
          }}>{d.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: d.flagged ? "var(--red)" : "var(--text)" }}>{d.name}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: d.flagged ? "var(--red)" : "var(--text3)", marginTop: 1 }}>{d.meta}</div>
          </div>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: d.flagged ? "var(--red)" : "var(--gold)", flexShrink: 0 }}>{d.hash}</div>
        </div>
      ))}
      <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
        <button style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          padding: "8px 16px", borderRadius: 6, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem",
          cursor: "pointer", background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gold)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}
        >
          + Upload & Record Document Hash
        </button>
      </div>
    </div>
  );
}
