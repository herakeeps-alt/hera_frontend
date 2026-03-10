"use client";

const schools = [
  { name: "Pumwani Girls Secondary", loc: "NAIROBI · ID: SCH-0042", amt: "KES 1.2M", pct: 88, color: "var(--green)", iconBg: "rgba(96,165,250,0.1)", iconBorder: "rgba(96,165,250,0.2)", flagged: false },
  { name: "Starehe Boys Centre", loc: "NAIROBI · ID: SCH-0017", amt: "KES 980K", pct: 95, color: "var(--gold)", iconBg: "rgba(201,168,76,0.1)", iconBorder: "rgba(201,168,76,0.2)", flagged: false },
  { name: "Kisumu Day Secondary", loc: "KISUMU · ID: SCH-0284", amt: "KES 760K", pct: 60, color: "var(--green)", iconBg: "rgba(52,211,153,0.1)", iconBorder: "rgba(52,211,153,0.2)", flagged: false },
  { name: "Kiambu Secondary School", loc: "KIAMBU · ID: SCH-0119", amt: "KES 545K", pct: 32, color: "var(--red)", iconBg: "rgba(248,113,113,0.1)", iconBorder: "rgba(248,113,113,0.2)", flagged: true },
  { name: "Mombasa Academy", loc: "MOMBASA · ID: SCH-0388", amt: "KES 430K", pct: 72, color: "var(--text2)", iconBg: "rgba(96,165,250,0.1)", iconBorder: "rgba(96,165,250,0.2)", flagged: false },
];

export default function SchoolsPanel() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>Top Schools by Disbursement</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)", cursor: "pointer" }}>All schools →</div>
      </div>
      {schools.map((s, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 20px", borderBottom: i < schools.length - 1 ? "1px solid rgba(30,40,64,0.5)" : "none",
          cursor: "pointer", transition: "background 0.12s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", flexShrink: 0, background: s.iconBg, border: `1px solid ${s.iconBorder}`,
          }}>{s.flagged ? "⚠" : "🏫"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)" }}>{s.name}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 1 }}>{s.loc}</div>
            <div style={{ height: 3, background: "var(--surface2)", borderRadius: 2, marginTop: 5, overflow: "hidden" }}>
              <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.88rem", fontWeight: 600, color: "var(--text)" }}>{s.amt}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: s.color, marginTop: 2 }}>
              {s.flagged ? "FLAGGED" : `${s.pct}% utilized`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
