"use client";
import Topbar from "@/app/components/Topbar";
import { fundsApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n/1_000_000).toFixed(2)}M`;
  return `KES ${(n/1000).toFixed(0)}K`;
}
const sourceColor = (t: string) => t === "government" ? "var(--blue)" : t === "ngo" ? "var(--green)" : "#a78bfa";
const sourceIcon  = (t: string) => t === "government" ? "🏛" : t === "ngo" ? "💚" : "🏦";

export default function DonorsPage() {
  const { data, loading, error, refetch } = useApi(() => fundsApi.list());

  if (loading) return <><Topbar title="Donors & Government" subtitle="Loading…" /><LoadingSpinner /></>;
  if (error)   return <><Topbar title="Donors & Government" /><ErrorBanner message={error} onRetry={refetch} /></>;

  const all = data?.items ?? [];
  const totalAmount = data?.total_amount ?? 0;

  // Build donor map from fund list
  const donorMap = all.reduce<Record<string, { source: string; type: string; total: number; count: number; programs: Set<string>; schools: Set<string>; schoolNames: Map<string, string> }>>((acc, f) => {
    if (!acc[f.source]) acc[f.source] = { source: f.source, type: f.source_type, total: 0, count: 0, programs: new Set(), schools: new Set(), schoolNames: new Map() };
    acc[f.source].total += f.amount;
    acc[f.source].count += 1;
    acc[f.source].programs.add(f.program);
    if (f.school_id) { acc[f.source].schools.add(f.school_id); if (f.school_name) acc[f.source].schoolNames.set(f.school_id, f.school_name); }
    return acc;
  }, {});
  const donors = Object.values(donorMap).sort((a, b) => b.total - a.total);
  const maxTotal = donors[0]?.total ?? 1;

  const govTotal     = all.filter(f => f.source_type === "government").reduce((s, f) => s + f.amount, 0);
  const ngoTotal     = all.filter(f => f.source_type === "ngo").reduce((s, f) => s + f.amount, 0);
  const privateTotal = all.filter(f => f.source_type === "private").reduce((s, f) => s + f.amount, 0);

  return (
    <>
      <Topbar title="Donors & Government" subtitle="Funding sources & contribution breakdown" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Gov Allocation", value: fmt(govTotal),     color: "var(--blue)",  icon: "🏛" },
          { label: "NGO Grants",     value: fmt(ngoTotal),     color: "var(--green)", icon: "💚" },
          { label: "Private Sector", value: fmt(privateTotal), color: "#a78bfa",      icon: "🏦" },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: "1.4rem", opacity: 0.8 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {donors.map(d => {
          const c    = sourceColor(d.type);
          const icon = sourceIcon(d.type);
          const pct  = Math.round((d.total / maxTotal) * 100);
          return (
            <div key={d.source} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", position: "relative", transition: "border-color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = c + "44")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${c},transparent)` }} />
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${c}15`, border: `1px solid ${c}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{d.source}</div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.54rem", background: `${c}15`, color: c, border: `1px solid ${c}28`, textTransform: "capitalize" }}>{d.type}</span>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>{fmt(d.total)}</div>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", marginTop: 2 }}>{d.count} fund{d.count > 1 ? "s" : ""}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)" }}>SHARE OF TOTAL FUNDING</span>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: c }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 2 }} />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 7 }}>Programs Funded</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {Array.from(d.programs).map(p => (
                      <span key={p} style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)" }}>{p}</span>
                    ))}
                  </div>
                </div>

                {d.schools.size > 0 && (
                  <div>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 7 }}>Schools Supported</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {Array.from(d.schools).map(sid => (
                        <span key={sid} style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", background: `${c}10`, color: c, border: `1px solid ${c}25` }}>
                          {d.schoolNames.get(sid) ?? sid}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
