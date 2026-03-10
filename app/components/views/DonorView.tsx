"use client";
import { fundsApi, transactionsApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  return `KES ${(n / 1000).toFixed(0)}K`;
}

export default function DonorView() {
  const { data: funds, loading: fl, error: fe, refetch: fr } = useApi(() => fundsApi.list({ source_type: "ngo" }));
  const { data: txns, loading: tl, error: te } = useApi(() => transactionsApi.list());

  if (fl || tl) return <LoadingSpinner label="Loading donor dashboard…" />;
  if (fe || te) return <ErrorBanner message={fe || te || "Error"} onRetry={fr} />;

  const items = funds?.items ?? [];
  const totalGiven = funds?.total_amount ?? 0;
  const schoolIds = [...new Set(items.map(f => f.school_id).filter(Boolean))];
  const studentsReached = 0; // would need school lookup — show school count instead

  const programs = items.reduce<Record<string, number>>((acc, f) => {
    acc[f.program] = (acc[f.program] ?? 0) + f.amount; return acc;
  }, {});
  const maxProg = Math.max(...Object.values(programs), 1);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)" }}>Donor Impact Dashboard</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>Green Future Foundation · Transparent Fund Tracking</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Contributed", value: fmt(totalGiven),             accent: "var(--green)", icon: "💚" },
          { label: "Schools Supported", value: String(schoolIds.length),    accent: "var(--blue)",  icon: "🏫" },
          { label: "Fund Records",      value: String(items.length),        accent: "var(--gold)",  icon: "📊" },
        ].map(({ label, value, accent, icon }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)` }} />
            <div style={{ position: "absolute", right: 14, top: 14, fontSize: "1.3rem", opacity: 0.15 }}>{icon}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Funding by Program</div>
          <div style={{ padding: 20 }}>
            {Object.entries(programs).map(([prog, amt]) => (
              <div key={prog} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text)" }}>{prog}</span>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--green)" }}>{fmt(amt)}</span>
                </div>
                <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(amt / maxProg) * 100}%`, background: "linear-gradient(90deg,#059669,var(--green))", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Schools Funded</div>
          {items.filter(f => f.school_id).map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid rgba(30,40,64,0.5)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>🏫</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text)" }}>{f.school_name ?? f.school_id}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 1 }}>{f.program}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.88rem", fontWeight: 600, color: "var(--green)" }}>{fmt(f.amount)}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", marginTop: 2, color: f.status === "disbursed" ? "var(--green)" : f.status === "flagged" ? "var(--red)" : "var(--gold)" }}>{f.status.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>On-chain Proof of Impact</div>
        <div style={{ padding: "10px 20px 6px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1 }}>VERIFIED TRANSACTIONS · IMMUTABLE LEDGER</div>
        </div>
        {(txns?.items ?? []).slice(0, 4).map((tx, i, arr) => (
          <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)" }}>{tx.tx_hash}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text)" }}>{tx.school_name || "National"}</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 1 }}>{tx.purpose}</div>
            </div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.9rem", fontWeight: 600 }}>{fmt(tx.amount)}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--green)" }}>✓ On-chain</div>
          </div>
        ))}
      </div>
    </div>
  );
}
