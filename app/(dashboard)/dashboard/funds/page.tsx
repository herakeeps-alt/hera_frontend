"use client";
import { useState } from "react";
import Topbar from "@/app/components/Topbar";
import { fundsApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n/1_000_000).toFixed(2)}M`;
  return `KES ${(n/1000).toFixed(0)}K`;
}
const statusColor = (s: string) => s === "disbursed" ? "var(--green)" : s === "flagged" ? "var(--red)" : "var(--gold)";
const sourceColor = (t: string) => t === "government" ? "var(--blue)" : t === "ngo" ? "var(--green)" : "#a78bfa";

export default function FundsPage() {
  const [filter, setFilter] = useState<"all" | "disbursed" | "pending" | "flagged">("all");
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useApi(
    () => fundsApi.list({ status: filter === "all" ? undefined : filter }),
    [filter]
  );

  if (loading) return <><Topbar title="Fund Flows" subtitle="Loading…" /><LoadingSpinner /></>;
  if (error)   return <><Topbar title="Fund Flows" /><ErrorBanner message={error} onRetry={refetch} /></>;

  const all = data?.items ?? [];
  const filtered = search
    ? all.filter(f => f.source.toLowerCase().includes(search.toLowerCase()) || f.program.toLowerCase().includes(search.toLowerCase()))
    : all;

  const totalAllocated = data?.total_amount ?? 0;
  const disbursed      = data?.disbursed_amount ?? 0;
  const pending        = data?.pending_amount ?? 0;
  const flaggedAmt     = all.filter(f => f.status === "flagged").reduce((s, f) => s + f.amount, 0);

  // Client-side aggregations for charts
  const byProgram = all.reduce<Record<string, number>>((acc, f) => { acc[f.program] = (acc[f.program] ?? 0) + f.amount; return acc; }, {});
  const bySource  = all.reduce<Record<string, number>>((acc, f) => { acc[f.source_type] = (acc[f.source_type] ?? 0) + f.amount; return acc; }, {});
  const maxProg   = Math.max(...Object.values(byProgram), 1);

  return (
    <>
      <Topbar title="Fund Flows" subtitle="All allocations & disbursements" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Tracked", value: fmt(totalAllocated), color: "var(--text)",  sub: `${all.length} records` },
          { label: "Disbursed",     value: fmt(disbursed),      color: "var(--green)", sub: `${all.filter(f=>f.status==="disbursed").length} transactions` },
          { label: "Pending",       value: fmt(pending),        color: "var(--gold)",  sub: `${all.filter(f=>f.status==="pending").length} awaiting` },
          { label: "Flagged",       value: fmt(flaggedAmt),     color: "var(--red)",   sub: `${all.filter(f=>f.status==="flagged").length} issues` },
        ].map(({ label, value, color, sub }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", marginTop: 6 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.8rem" }}>By Program</div>
          <div style={{ padding: 20 }}>
            {Object.entries(byProgram).sort((a,b) => b[1]-a[1]).map(([prog, amt]) => (
              <div key={prog} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--text)" }}>{prog}</span>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--gold)" }}>{fmt(amt)}</span>
                </div>
                <div style={{ height: 5, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(amt/maxProg)*100}%`, background: "linear-gradient(90deg,var(--gold),var(--gold2))", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.8rem" }}>By Source</div>
          <div style={{ padding: 20 }}>
            {Object.entries(bySource).map(([src, amt]) => {
              const c = sourceColor(src);
              const pct = totalAllocated > 0 ? Math.round((amt / totalAllocated) * 100) : 0;
              return (
                <div key={src} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--text)", textTransform: "capitalize" }}>{src}</span>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: c }}>{fmt(amt)} · {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {["government","ngo","private"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: sourceColor(t) }} />
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", textTransform: "capitalize" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {(["all","disbursed","pending","flagged"] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 12px", borderRadius: 5, cursor: "pointer", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, background: filter === s ? "var(--gold-dim)" : "var(--surface2)", color: filter === s ? "var(--gold2)" : "var(--text3)", border: filter === s ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent" }}>{s}</button>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--text3)", fontSize: "0.8rem" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search source or program…" style={{ background: "none", border: "none", outline: "none", color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.68rem", flex: 1 }} />
          </div>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>{filtered.length} RECORDS</div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["SOURCE","PROGRAM","SCHOOL","AMOUNT","DATE","TYPE","STATUS"].map(h => (
                <th key={h} style={{ fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", padding: "8px 20px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const sc = sourceColor(f.source_type);
                const stc = statusColor(f.status);
                return (
                  <tr key={f.id} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontSize: "0.76rem", fontWeight: 700, color: "var(--text)" }}>{f.source}</td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontSize: "0.73rem", color: "var(--text2)" }}>{f.program}</td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--text3)" }}>{f.school_name ?? "National"}</td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontFamily: "Fraunces, serif", fontSize: "0.9rem", fontWeight: 600 }}>{fmt(f.amount)}</td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", whiteSpace: "nowrap" }}>{f.fund_date}</td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", background: `${sc}15`, color: sc, border: `1px solid ${sc}28`, textTransform: "capitalize" }}>{f.source_type}</span>
                    </td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", background: `${stc}15`, color: stc, border: `1px solid ${stc}28`, textTransform: "uppercase" }}>{f.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
