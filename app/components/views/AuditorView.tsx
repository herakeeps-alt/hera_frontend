"use client";
import { transactionsApi, documentsApi, fundsApi, dashboardApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  return `KES ${(n / 1000).toFixed(0)}K`;
}

export default function AuditorView() {
  const { data: stats, loading: sl, error: se, refetch: sr } = useApi(() => dashboardApi.stats());
  const { data: flagged, loading: fl, error: fe } = useApi(() => transactionsApi.flagged());
  const { data: txns, loading: tl } = useApi(() => transactionsApi.list());
  const { data: funds, loading: fnl } = useApi(() => fundsApi.list());

  if (sl || fl || tl || fnl) return <LoadingSpinner label="Loading audit dashboard…" />;
  if (se || fe) return <ErrorBanner message={se || fe || "Error"} onRetry={sr} />;

  const auditCoverage = funds && funds.total_amount > 0
    ? Math.round((funds.disbursed_amount / funds.total_amount) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)" }}>Audit Dashboard</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>Office of the Auditor General · Full Access View</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Flagged Transactions", value: String(stats?.flagged_transactions ?? 0), accent: "var(--red)",   icon: "🚨", sub: "Requires review" },
          { label: "Hash Mismatches",      value: String(stats?.pending_documents ?? 0),   accent: "var(--red)",   icon: "⚠",  sub: "Document integrity" },
          { label: "Pending Verification", value: String(flagged?.filter(t => t.integrity_check === "pending").length ?? 0), accent: "#f59e0b", icon: "⏳", sub: "Awaiting confirmation" },
          { label: "Audit Coverage",       value: `${auditCoverage}%`,                     accent: "var(--green)", icon: "✅", sub: `${fmt(funds?.disbursed_amount ?? 0)} verified` },
        ].map(({ label, value, accent, icon, sub }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)` }} />
            <div style={{ position: "absolute", right: 14, top: 14, fontSize: "1.3rem", opacity: 0.15 }}>{icon}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>{value}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 6 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.9rem" }}>🚨</span>
          <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--red)" }}>Flagged Transactions — Requires Action</div>
        </div>
        {(flagged ?? []).map((tx, i, arr) => (
          <div key={tx.id} style={{ padding: "16px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", borderLeft: "3px solid var(--red)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)" }}>{tx.tx_hash}</div>
                  <span style={{ padding: "1px 7px", borderRadius: 3, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", background: "rgba(248,113,113,0.1)", color: "var(--red)", border: "1px solid rgba(248,113,113,0.2)" }}>FLAGGED</span>
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{tx.school_name || "National"}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>{tx.purpose} · Block #{tx.block_number.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.95rem", fontWeight: 600 }}>{fmt(tx.amount)}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--red)", marginTop: 3 }}>✗ Hash Mismatch</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", marginTop: 2 }}>{tx.tx_date}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button style={{ padding: "5px 12px", borderRadius: 5, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--red)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", cursor: "pointer" }}>Escalate Issue</button>
              <button style={{ padding: "5px 12px", borderRadius: 5, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text2)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", cursor: "pointer" }}>View Evidence</button>
              <button style={{ padding: "5px 12px", borderRadius: 5, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--green)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", cursor: "pointer" }}>Mark Resolved</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Full Audit Trail — All Transactions</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["BLOCK","TX HASH","SCHOOL","AMOUNT","PURPOSE","GAS USED","INTEGRITY"].map(h => (
                <th key={h} style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", padding: "8px 20px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {(txns?.items ?? []).map((tx, i, arr) => (
                <tr key={tx.id} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>#{tx.block_number.toLocaleString()}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)" }}>{tx.tx_hash}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontSize: "0.76rem", fontWeight: 600, color: "var(--text)" }}>{tx.school_name || "National"}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "Fraunces, serif", fontSize: "0.88rem", fontWeight: 600 }}>{fmt(tx.amount)}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text2)" }}>{tx.purpose}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>{tx.gas_used?.toLocaleString() ?? "—"}</td>
                  <td style={{ padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: tx.integrity_check === "verified" ? "var(--green)" : tx.integrity_check === "mismatch" ? "var(--red)" : "var(--text3)" }}>
                    {tx.integrity_check === "verified" ? "✓ Verified" : tx.integrity_check === "mismatch" ? "✗ Mismatch" : "⏳ Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
