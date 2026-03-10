"use client";
import { useState } from "react";
import Topbar from "@/app/components/Topbar";
import { transactionsApi, type Transaction } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n/1_000_000).toFixed(1)}M`;
  return `KES ${(n/1000).toFixed(0)}K`;
}

const tabs = ["All", "Allocation", "Disbursement", "Receipt", "Flagged"] as const;
const typeStyle: Record<string, { bg: string; color: string; border: string }> = {
  allocation:   { bg: "rgba(96,165,250,0.1)",  color: "var(--blue)",  border: "rgba(96,165,250,0.2)" },
  disbursement: { bg: "rgba(52,211,153,0.1)",  color: "var(--green)", border: "rgba(52,211,153,0.2)" },
  receipt:      { bg: "rgba(201,168,76,0.1)",  color: "var(--gold)",  border: "rgba(201,168,76,0.2)" },
  flagged:      { bg: "rgba(248,113,113,0.1)", color: "var(--red)",   border: "rgba(248,113,113,0.2)" },
};

export default function TransactionsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const txType = tab === "All" ? undefined : tab.toLowerCase();
  const { data, loading, error, refetch } = useApi(
    () => transactionsApi.list({ tx_type: txType }),
    [tab]
  );

  if (loading) return <><Topbar title="Transactions" subtitle="Loading…" /><LoadingSpinner /></>;
  if (error)   return <><Topbar title="Transactions" /><ErrorBanner message={error} onRetry={refetch} /></>;

  const all = data?.items ?? [];
  const filtered = search
    ? all.filter(tx =>
        tx.tx_hash.includes(search) ||
        (tx.school_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        tx.purpose.toLowerCase().includes(search.toLowerCase())
      )
    : all;

  const tx = selected ? filtered.find(t => t.id === selected) : null;

  return (
    <>
      <Topbar title="Transactions" subtitle={`${data?.total ?? 0} on-chain records`} />

      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); setSelected(null); }}
            style={{ padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "0.75rem", background: tab === t ? "var(--gold-dim)" : "var(--surface)", color: tab === t ? "var(--gold2)" : "var(--text2)", borderBottom: tab === t ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent", transition: "all 0.12s" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: tx ? "1fr 380px" : "1fr", gap: 20, alignItems: "start" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text3)" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hash, school, purpose…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.7rem" }} />
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>{filtered.length} TXS</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["TX HASH","TYPE","SCHOOL","AMOUNT","INTEGRITY","DATE"].map(h => (
                  <th key={h} style={{ fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", padding: "8px 20px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const ts = typeStyle[t.tx_type] ?? typeStyle.flagged;
                  const isSel = selected === t.id;
                  return (
                    <tr key={t.id} onClick={() => setSelected(isSel ? null : t.id)}
                      style={{ cursor: "pointer", background: isSel ? "rgba(255,255,255,0.03)" : "transparent", borderLeft: isSel ? "3px solid var(--gold)" : "3px solid transparent" }}
                      onMouseEnter={e => !isSel && (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => !isSel && (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)" }}><span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)" }}>{t.tx_hash}</span></td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)" }}><span style={{ ...ts, display: "inline-flex", padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.58rem", border: `1px solid ${ts.border}`, whiteSpace: "nowrap" }}>● {t.tx_type}</span></td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text)" }}>{t.school_name || "National"}</td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontFamily: "Fraunces, serif", fontSize: "0.9rem", fontWeight: 600 }}>{fmt(t.amount)}</td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: t.integrity_check === "verified" ? "var(--green)" : t.integrity_check === "mismatch" ? "var(--red)" : "var(--text3)" }}>
                        {t.integrity_check === "verified" ? "✓ Verified" : t.integrity_check === "mismatch" ? "✗ Mismatch" : "⏳ Pending"}
                      </td>
                      <td style={{ padding: "13px 20px", borderBottom: "1px solid rgba(30,40,64,0.4)", fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", whiteSpace: "nowrap" }}>{t.tx_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {tx && (
          <div className="fade-in" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>Transaction Detail</div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "1rem" }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              {[
                { label: "Hash",      value: tx.tx_hash,                    mono: true,  color: "var(--gold)" },
                { label: "Block",     value: `#${tx.block_number.toLocaleString()}`, mono: true },
                { label: "Type",      value: tx.tx_type.toUpperCase(),      mono: true },
                { label: "School",    value: tx.school_name || "National" },
                { label: "Amount",    value: fmt(tx.amount),                serif: true },
                { label: "Purpose",   value: tx.purpose },
                { label: "Date",      value: tx.tx_date,                    mono: true },
                { label: "Status",    value: tx.status.toUpperCase(),       mono: true,  color: tx.status === "confirmed" ? "var(--green)" : "var(--gold)" },
                { label: "Integrity", value: tx.integrity_check === "verified" ? "✓ Hash Verified" : tx.integrity_check === "mismatch" ? "✗ Hash Mismatch" : "⏳ Pending", mono: true, color: tx.integrity_check === "verified" ? "var(--green)" : tx.integrity_check === "mismatch" ? "var(--red)" : "var(--text3)" },
                { label: "Gas Used",  value: tx.gas_used ? `${tx.gas_used.toLocaleString()} units` : "—", mono: true },
              ].map(({ label, value, mono, serif, color }: any) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(30,40,64,0.4)" }}>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", flexShrink: 0, marginRight: 12 }}>{label}</span>
                  <span style={{ fontFamily: mono ? "DM Mono, monospace" : serif ? "Fraunces, serif" : "Syne, sans-serif", fontSize: mono ? "0.62rem" : serif ? "0.95rem" : "0.75rem", fontWeight: serif ? 600 : 500, color: color || "var(--text)", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
                </div>
              ))}
              {tx.document_id && (
                <div style={{ marginTop: 16, padding: "10px 14px", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6 }}>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--gold)", marginBottom: 4 }}>LINKED DOCUMENT</div>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text2)" }}>{tx.document_id} → IPFS verified</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
