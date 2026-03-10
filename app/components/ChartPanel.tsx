"use client";

const bars = [
  { month: "Jul", h: 55, color: "linear-gradient(180deg,#60a5fa,#2563eb)" },
  { month: "Aug", h: 72, color: "linear-gradient(180deg,#60a5fa,#2563eb)" },
  { month: "Sep", h: 48, color: "linear-gradient(180deg,#60a5fa,#2563eb)" },
  { month: "Oct", h: 90, color: "linear-gradient(180deg,#c9a84c,#8b5e1a)" },
  { month: "Nov", h: 63, color: "linear-gradient(180deg,#60a5fa,#2563eb)" },
  { month: "Dec", h: 78, color: "linear-gradient(180deg,#60a5fa,#2563eb)" },
  { month: "Jan", h: 44, color: "linear-gradient(180deg,#60a5fa,#2563eb)" },
  { month: "Feb", h: 82, color: "linear-gradient(180deg,#34d399,#059669)" },
  { month: "Mar", h: 38, color: "linear-gradient(180deg,#34d399,#059669)", dim: true },
];

const sources = [
  { label: "Gov Grants", pct: 78, val: "KES 78.4M", color: "linear-gradient(90deg, #8b5e1a, var(--gold2))" },
  { label: "NGO Donors", pct: 45, val: "KES 42.1M", color: "linear-gradient(90deg, #059669, var(--green))" },
  { label: "Private Sector", pct: 24, val: "KES 22.1M", color: "linear-gradient(90deg, #2563eb, var(--blue))" },
];

export default function ChartPanel() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>Monthly Disbursements — FY 2024–25</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)", cursor: "pointer" }}>View full chart →</div>
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, padding: "20px 20px 0", height: 130 }}>
        {bars.map(({ month, h, color, dim }) => (
          <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", background: "var(--surface2)", borderRadius: "3px 3px 0 0", overflow: "hidden", height: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", height: `${h}%`, background: color, borderRadius: "3px 3px 0 0", opacity: dim ? 0.5 : 1, transition: "height 1s" }} />
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "var(--text3)" }}>{month}</div>
          </div>
        ))}
      </div>

      {/* Fund sources */}
      <div style={{ padding: "20px" }}>
        {sources.map(({ label, pct, val, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 90, flexShrink: 0, fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--text2)", textAlign: "right" }}>{label}</div>
            <div style={{ flex: 1, height: 8, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }} />
            </div>
            <div style={{ width: 60, fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--text2)" }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
