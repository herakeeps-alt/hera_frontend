"use client";
import { useState } from "react";
import Topbar from "@/app/components/Topbar";
import { documentsApi, type Document } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

const typeColors: Record<string, string> = {
  invoice: "var(--blue)", receipt: "var(--green)", allocation: "var(--gold)",
  grant: "#a78bfa", audit: "var(--red)",
};
const filters = ["All", "invoice", "receipt", "allocation", "grant", "audit"] as const;

const integrityStyle = (s: string) =>
  s === "verified"  ? { color: "var(--green)", icon: "✓", label: "Verified" }
  : s === "mismatch" ? { color: "var(--red)",   icon: "✗", label: "Hash Mismatch" }
  : { color: "var(--text3)", icon: "⏳", label: "Pending" };

export default function DocumentsPage() {
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi(
    () => documentsApi.list({ doc_type: filter === "All" ? undefined : filter }),
    [filter]
  );

  if (loading) return <><Topbar title="Documents" subtitle="Loading…" /><LoadingSpinner /></>;
  if (error)   return <><Topbar title="Documents" /><ErrorBanner message={error} onRetry={refetch} /></>;

  const all = data?.items ?? [];
  const filtered = search
    ? all.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.ipfs_cid.toLowerCase().includes(search.toLowerCase()))
    : all;

  const doc = selected ? filtered.find(d => d.id === selected) : null;

  return (
    <>
      <Topbar title="Documents" subtitle={`${data?.total ?? 0} files on IPFS · hash-verified on-chain`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Verified",      count: data?.verified ?? 0,       color: "var(--green)" },
          { label: "Hash Mismatch", count: data?.mismatched ?? 0,     color: "var(--red)" },
          { label: "Pending Review",count: data?.pending_count ?? 0,  color: "var(--gold)" },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "DM Mono, monospace", fontWeight: 600, fontSize: "0.62rem", background: filter === f ? "var(--gold-dim)" : "var(--surface)", color: filter === f ? "var(--gold2)" : "var(--text2)", border: filter === f ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent", textTransform: "uppercase", letterSpacing: 1 }}>{f}</button>
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 8, padding: "7px 14px" }}>
          <span style={{ color: "var(--text3)", fontSize: "0.8rem" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by filename or CID…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.68rem" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: doc ? "1fr 380px" : "1fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "grid", gridTemplateColumns: doc ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map(d => {
            const { color, icon, label } = integrityStyle(d.integrity_check);
            const tc = typeColors[d.doc_type] || "var(--text2)";
            const isSel = selected === d.id;
            return (
              <div key={d.id} onClick={() => setSelected(isSel ? null : d.id)}
                style={{ background: "var(--surface)", border: `1px solid ${isSel ? tc + "55" : "var(--border)"}`, borderRadius: 10, padding: 18, cursor: "pointer", transition: "all 0.15s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tc + "44"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isSel ? tc + "55" : "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}>
                {d.integrity_check === "mismatch" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--red)" }} />}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: `${tc}15`, border: `1px solid ${tc}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", marginBottom: 3, wordBreak: "break-word" }}>{d.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ padding: "1px 7px", borderRadius: 3, fontFamily: "DM Mono, monospace", fontSize: "0.54rem", background: `${tc}15`, color: tc, border: `1px solid ${tc}25`, textTransform: "uppercase" }}>{d.doc_type}</span>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color, fontWeight: 600 }}>{icon} {label}</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--surface2)", borderRadius: 6, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", wordBreak: "break-all" }}>{d.ipfs_cid}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)" }}>{d.school_name ?? "National"} · {d.file_size ?? "—"}</span>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)" }}>{d.upload_date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {doc && (
          <div className="fade-in" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", position: "sticky", top: 20 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>Document Detail</div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "1rem" }}>✕</button>
            </div>

            {doc.integrity_check === "mismatch" && (
              <div style={{ margin: "14px 20px 0", padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 6 }}>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--red)", fontWeight: 700 }}>⚠ HASH MISMATCH DETECTED</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text2)", marginTop: 4 }}>On-chain hash does not match IPFS document. This may indicate tampering.</div>
              </div>
            )}

            <div style={{ padding: 20 }}>
              {[
                { label: "Filename",      value: doc.name },
                { label: "Type",          value: doc.doc_type.toUpperCase(), mono: true, color: typeColors[doc.doc_type] },
                { label: "School",        value: doc.school_name ?? "National" },
                { label: "IPFS CID",      value: doc.ipfs_cid,       mono: true, color: "var(--blue)" },
                { label: "On-chain Hash", value: doc.on_chain_hash,  mono: true, color: "var(--gold)" },
                { label: "Uploaded By",   value: doc.uploader_name },
                { label: "Role",          value: doc.uploader_role,  mono: true },
                { label: "Date",          value: doc.upload_date,    mono: true },
                { label: "File Size",     value: doc.file_size ?? "—", mono: true },
                { label: "Integrity",     value: integrityStyle(doc.integrity_check).icon + " " + integrityStyle(doc.integrity_check).label, mono: true, color: integrityStyle(doc.integrity_check).color },
              ].map(({ label, value, mono, color }: any) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(30,40,64,0.4)" }}>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", flexShrink: 0, marginRight: 12 }}>{label}</span>
                  <span style={{ fontFamily: mono ? "DM Mono, monospace" : "Syne, sans-serif", fontSize: "0.65rem", fontWeight: 600, color: color || "var(--text)", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button style={{ flex: 1, padding: "9px", borderRadius: 6, background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.25)", color: "var(--gold2)", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", fontWeight: 700, cursor: "pointer" }}>View on IPFS ↗</button>
                {doc.integrity_check === "mismatch" && (
                  <button style={{ flex: 1, padding: "9px", borderRadius: 6, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "var(--red)", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", fontWeight: 700, cursor: "pointer" }}>Flag Issue</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
