"use client";
import { useAuth } from "@/app/context/AuthContext";
import { dashboardApi, transactionsApi, schoolsApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  return `KES ${(n / 1000).toFixed(0)}K`;
}

export default function MinistryView() {
  const { data: stats, loading: sl, error: se, refetch: sr } = useApi(() => dashboardApi.stats());
  const { data: schools, loading: scl, error: sce } = useApi(() => schoolsApi.list());
  const { data: txns, loading: tl, error: te } = useApi(() => transactionsApi.list());

  if (sl || scl || tl) return <LoadingSpinner label="Loading national overview…" />;
  if (se || sce || te) return <ErrorBanner message={se || sce || te || "Error"} onRetry={sr} />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)" }}>National Overview</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>Ministry of Education · FY 2025–26</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Allocated",  value: fmt(stats?.total_allocated ?? 0), accent: "var(--gold)",  icon: "💰" },
          { label: "Total Disbursed",  value: fmt(stats?.total_disbursed ?? 0),  accent: "var(--green)", icon: "✅" },
          { label: "Schools Funded",   value: String(stats?.total_schools ?? 0), accent: "var(--blue)",  icon: "🏫" },
          { label: "Flagged Txns",     value: String(stats?.flagged_transactions ?? 0), accent: "var(--red)", icon: "⚠" },
        ].map(({ label, value, accent, icon }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)` }} />
            <div style={{ position: "absolute", right: 14, top: 14, fontSize: "1.3rem", opacity: 0.15 }}>{icon}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Schools table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>All Schools — Funding Status</div>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>{schools?.total ?? 0} SCHOOLS</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["SCHOOL","COUNTY","STUDENTS","ALLOCATED","DISBURSED","UTILIZATION","STATUS"].map(h => (
                <th key={h} style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", padding: "8px 20px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {(schools?.items ?? []).map((s, i, arr) => (
                <tr key={s.id} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} style={{ cursor: "pointer" }}>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontWeight: 700, fontSize: "0.78rem", color: "var(--text)" }}>{s.name}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--text2)" }}>{s.county}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--text2)" }}>{s.students.toLocaleString()}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "Fraunces, serif", fontSize: "0.88rem", fontWeight: 600 }}>{fmt(s.allocated)}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "Fraunces, serif", fontSize: "0.88rem", fontWeight: 600, color: "var(--green)" }}>{fmt(s.disbursed)}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${s.utilization}%`, background: s.utilization >= 80 ? "var(--green)" : s.utilization >= 50 ? "var(--gold)" : "var(--red)", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text2)", width: 32 }}>{s.utilization}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.58rem", fontWeight: 600, background: s.status === "active" ? "rgba(52,211,153,0.1)" : s.status === "flagged" ? "rgba(248,113,113,0.1)" : "rgba(201,168,76,0.1)", color: s.status === "active" ? "var(--green)" : s.status === "flagged" ? "var(--red)" : "var(--gold)", border: `1px solid ${s.status === "active" ? "rgba(52,211,153,0.2)" : s.status === "flagged" ? "rgba(248,113,113,0.2)" : "rgba(201,168,76,0.2)"}` }}>{s.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Blockchain Ledger — Recent Transactions</div>
        {(txns?.items ?? []).slice(0, 5).map((tx, i) => (
          <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 20px", borderBottom: i < 4 ? "1px solid rgba(30,40,64,0.5)" : "none" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)" }}>{tx.tx_hash}</div>
            <div style={{ flex: 1, fontSize: "0.75rem", fontWeight: 600, color: "var(--text)" }}>{tx.school_name || "National"}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.9rem", fontWeight: 600 }}>{fmt(tx.amount)}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: tx.integrity_check === "verified" ? "var(--green)" : tx.integrity_check === "mismatch" ? "var(--red)" : "var(--text3)" }}>
              {tx.integrity_check === "verified" ? "✓ Verified" : tx.integrity_check === "mismatch" ? "✗ Mismatch" : "⏳ Pending"}
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)" }}>{tx.tx_date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
