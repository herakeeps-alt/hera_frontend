"use client";
import { useState, useCallback } from "react";
import Topbar from "@/app/components/Topbar";
import { schoolsApi, fundsApi, transactionsApi, type School } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n/1_000_000).toFixed(2)}M`;
  return `KES ${(n/1000).toFixed(0)}K`;
}
const statusColor = (st: string) => st === "active" ? "var(--green)" : st === "flagged" ? "var(--red)" : "var(--gold)";

export default function SchoolsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useApi(() => schoolsApi.list({ search: search || undefined }), [search]);
  const { data: schoolDetail } = useApi(() => selected ? schoolsApi.get(selected) : Promise.resolve(null), [selected]);
  const { data: schoolFunds }  = useApi(() => selected ? fundsApi.list({ school_id: selected }) : Promise.resolve(null), [selected]);
  const { data: schoolTxns }   = useApi(() => selected ? transactionsApi.list({ school_id: selected }) : Promise.resolve(null), [selected]);

  if (loading) return <><Topbar title="Schools" subtitle="Loading…" /><LoadingSpinner /></>;
  if (error) return <><Topbar title="Schools" /><ErrorBanner message={error} onRetry={refetch} /></>;

  const schools = data?.items ?? [];
  const school = schoolDetail;

  return (
    <>
      <Topbar title="Schools" subtitle={`${data?.total ?? 0} institutions on-chain`} />
      <div style={{ display: "grid", gridTemplateColumns: school ? "1fr 420px" : "1fr", gap: 20, alignItems: "start" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "var(--text3)" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or county…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.7rem" }} />
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>{schools.length} SCHOOLS</div>
          </div>
          {schools.map((s, i) => (
            <div key={s.id} onClick={() => setSelected(s.id === selected ? null : s.id)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < schools.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none", cursor: "pointer", background: selected === s.id ? "rgba(255,255,255,0.03)" : "transparent", borderLeft: selected === s.id ? `3px solid ${statusColor(s.status)}` : "3px solid transparent", transition: "all 0.12s" }}
              onMouseEnter={e => selected !== s.id && (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={e => selected !== s.id && (e.currentTarget.style.background = "transparent")}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${statusColor(s.status)}15`, border: `1px solid ${statusColor(s.status)}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{s.status === "flagged" ? "⚠" : "🏫"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text)" }}>{s.name}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 2 }}>{s.county} · {s.students} students · {s.programs.length} programs</div>
                <div style={{ height: 3, background: "var(--surface2)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.utilization}%`, background: s.utilization >= 80 ? "var(--green)" : s.utilization >= 50 ? "var(--gold)" : "var(--red)", borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.9rem", fontWeight: 600 }}>{fmt(s.allocated)}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: statusColor(s.status), marginTop: 3 }}>{s.utilization}% used</div>
              </div>
            </div>
          ))}
        </div>

        {school && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${statusColor(school.status)},transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", flex: 1, marginRight: 10 }}>{school.name}</div>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", fontWeight: 600, background: `${statusColor(school.status)}15`, color: statusColor(school.status), border: `1px solid ${statusColor(school.status)}30`, flexShrink: 0 }}>{school.status.toUpperCase()}</span>
              </div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginBottom: 16 }}>{school.county} · {school.constituency}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[{ label: "Students", value: school.students.toLocaleString() }, { label: "Teachers", value: String(school.teachers) }, { label: "Programs", value: String(school.programs.length) }].map(({ label, value }) => (
                  <div key={label} style={{ background: "var(--surface2)", borderRadius: 6, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>{value}</div>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.54rem", color: "var(--text3)", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.78rem" }}>Funding</div>
              <div style={{ padding: 18 }}>
                {[{ label: "Allocated", value: fmt(school.allocated), color: "var(--text)" }, { label: "Disbursed", value: fmt(school.disbursed), color: "var(--green)" }, { label: "Remaining", value: fmt(school.allocated - school.disbursed), color: "var(--gold)" }].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--text2)" }}>{label}</span>
                    <span style={{ fontFamily: "Fraunces, serif", fontSize: "0.88rem", fontWeight: 600, color }}>{value}</span>
                  </div>
                ))}
                <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
                  <div style={{ height: "100%", width: `${school.utilization}%`, background: school.utilization >= 80 ? "var(--green)" : school.utilization >= 50 ? "var(--gold)" : "var(--red)", borderRadius: 3 }} />
                </div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 6 }}>{school.utilization}% utilization</div>
              </div>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.78rem" }}>Active Programs</div>
              {school.programs.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderBottom: i < school.programs.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                  <div style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text)", flex: 1 }}>{p}</div>
                  <span style={{ padding: "1px 7px", borderRadius: 3, fontFamily: "DM Mono, monospace", fontSize: "0.54rem", background: "rgba(52,211,153,0.1)", color: "var(--green)", border: "1px solid rgba(52,211,153,0.2)" }}>ACTIVE</span>
                </div>
              ))}
            </div>

            {(schoolTxns?.items ?? []).length > 0 && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.78rem" }}>On-chain Transactions</div>
                {(schoolTxns?.items ?? []).map((tx, i, arr) => (
                  <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--gold)" }}>{tx.tx_hash}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text2)", marginTop: 2 }}>{tx.purpose}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.85rem", fontWeight: 600 }}>{fmt(tx.amount)}</div>
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: tx.integrity_check === "verified" ? "var(--green)" : "var(--red)", marginTop: 2 }}>{tx.integrity_check === "verified" ? "✓ Verified" : "✗ Mismatch"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
