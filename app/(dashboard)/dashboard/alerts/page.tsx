"use client";
import { useState } from "react";
import Topbar from "@/app/components/Topbar";
import { transactionsApi, documentsApi, dashboardApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

type AlertSeverity = "critical" | "warning" | "info";
interface Alert {
  id: string; severity: AlertSeverity; title: string;
  description: string; entity: string; time: string;
  resolved: boolean; category: "integrity" | "compliance" | "activity";
}

const severityConfig: Record<AlertSeverity, { color: string; bg: string; border: string; icon: string; label: string }> = {
  critical: { color: "var(--red)",  bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", icon: "🚨", label: "Critical" },
  warning:  { color: "var(--gold)", bg: "rgba(201,168,76,0.08)",  border: "rgba(201,168,76,0.25)",  icon: "⚠",  label: "Warning" },
  info:     { color: "var(--blue)", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.25)",  icon: "ℹ",  label: "Info" },
};

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [severity, setSeverity] = useState<"all" | AlertSeverity>("all");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const { data: flaggedTxns, loading: fl, error: fe, refetch } = useApi(() => transactionsApi.flagged());
  const { data: docs, loading: dl } = useApi(() => documentsApi.list({ integrity: "mismatch" }));
  const { data: stats, loading: sl } = useApi(() => dashboardApi.stats());

  if (fl || dl || sl) return <><Topbar title="Alerts" subtitle="Loading…" /><LoadingSpinner /></>;
  if (fe) return <><Topbar title="Alerts" /><ErrorBanner message={fe} onRetry={refetch} /></>;

  // Build alerts from real backend data
  const alerts: Alert[] = [
    // Flagged transaction alerts
    ...(flaggedTxns ?? []).map(tx => ({
      id: `tx-${tx.id}`,
      severity: "critical" as AlertSeverity,
      title: "Flagged Transaction Under Review",
      description: `Transaction ${tx.tx_hash} for ${tx.amount.toLocaleString()} KES (${tx.purpose}) has been flagged for manual verification. Document hash mismatch confirmed.`,
      entity: tx.school_name || "National",
      time: tx.tx_date,
      resolved: false,
      category: "compliance" as const,
    })),
    // Document mismatch alerts
    ...(docs?.items ?? []).map(doc => ({
      id: `doc-${doc.id}`,
      severity: "critical" as AlertSeverity,
      title: "Hash Mismatch Detected",
      description: `Document ${doc.name} has a different hash than what was recorded on-chain. Possible document tampering.`,
      entity: doc.school_name || "National",
      time: doc.upload_date,
      resolved: false,
      category: "integrity" as const,
    })),
    // Static info/activity alerts
    {
      id: "info-1", severity: "info", title: "New Block Confirmed — Q1 Allocation",
      description: `Block #21847290 confirmed a national Q1 2026 allocation. All funds are now trackable on the ledger.`,
      entity: "Ministry of Education", time: "18 min ago", resolved: true, category: "activity",
    },
    {
      id: "info-2", severity: "info", title: "Bursary Disbursement Completed",
      description: "KCB Foundation bursary successfully disbursed and receipt verified on-chain for Nakuru Girls High.",
      entity: "Nakuru Girls High", time: "3 days ago", resolved: true, category: "activity",
    },
    {
      id: "warn-1", severity: "warning", title: "Document Integrity Pending",
      description: "An invoice has been uploaded but its on-chain hash verification is still pending after 48 hours.",
      entity: "Kisumu Day Secondary", time: "2 days ago", resolved: false, category: "integrity",
    },
  ];

  const filtered = alerts.filter(a => {
    if (dismissed.has(a.id)) return false;
    const matchStatus = filter === "all" || (filter === "active" ? !a.resolved : a.resolved);
    const matchSev = severity === "all" || a.severity === severity;
    return matchStatus && matchSev;
  });

  const active   = alerts.filter(a => !a.resolved && !dismissed.has(a.id));
  const critical = active.filter(a => a.severity === "critical");

  return (
    <>
      <Topbar title="Alerts" subtitle={`${active.length} active · ${critical.length} critical`} />

      {critical.length > 0 && (
        <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.2rem" }}>🚨</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--red)" }}>{critical.length} Critical Alert{critical.length > 1 ? "s" : ""} Require Immediate Action</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text2)", marginTop: 3 }}>Hash mismatches detected — potential document integrity issues. Review and escalate immediately.</div>
          </div>
          <button style={{ padding: "7px 14px", borderRadius: 6, background: "var(--red)", border: "none", color: "#fff", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", fontWeight: 700, cursor: "pointer" }}>Review Now</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {(["critical","warning","info"] as AlertSeverity[]).map(sev => {
          const cfg = severityConfig[sev];
          const cnt = alerts.filter(a => a.severity === sev && !dismissed.has(a.id)).length;
          return (
            <div key={sev} onClick={() => setSeverity(severity === sev ? "all" : sev)}
              style={{ background: severity === sev ? cfg.bg : "var(--surface)", border: `1px solid ${severity === sev ? cfg.border : "var(--border)"}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.2rem" }}>{cfg.icon}</span>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", fontWeight: 600, color: cfg.color, lineHeight: 1 }}>{cnt}</div>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>{cfg.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {(["all","active","resolved"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "DM Mono, monospace", fontWeight: 600, fontSize: "0.62rem", background: filter === f ? "var(--gold-dim)" : "var(--surface)", color: filter === f ? "var(--gold2)" : "var(--text2)", border: filter === f ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent", textTransform: "uppercase", letterSpacing: 1 }}>{f}</button>
        ))}
        <div style={{ marginLeft: "auto", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", display: "flex", alignItems: "center" }}>{filtered.length} ALERTS</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(alert => {
          const cfg = severityConfig[alert.severity];
          return (
            <div key={alert.id} style={{ background: alert.resolved ? "var(--surface)" : cfg.bg, border: `1px solid ${alert.resolved ? "var(--border)" : cfg.border}`, borderRadius: 10, padding: "16px 20px", position: "relative", overflow: "hidden", boxShadow: `inset 3px 0 0 ${cfg.color}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: alert.resolved ? "var(--text2)" : "var(--text)" }}>{alert.title}</div>
                    <span style={{ padding: "1px 7px", borderRadius: 3, fontFamily: "DM Mono, monospace", fontSize: "0.54rem", background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}28` }}>{cfg.label.toUpperCase()}</span>
                    {alert.resolved && <span style={{ padding: "1px 7px", borderRadius: 3, fontFamily: "DM Mono, monospace", fontSize: "0.54rem", background: "rgba(52,211,153,0.1)", color: "var(--green)", border: "1px solid rgba(52,211,153,0.2)" }}>RESOLVED</span>}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 1.65, marginBottom: 10 }}>{alert.description}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)" }}>🏫 {alert.entity}</span>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)" }}>🕐 {alert.time}</span>
                    <span style={{ padding: "1px 7px", borderRadius: 3, fontFamily: "DM Mono, monospace", fontSize: "0.54rem", background: "var(--surface2)", color: "var(--text3)", border: "1px solid var(--border)" }}>{alert.category}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {!alert.resolved && alert.severity !== "info" && (
                    <button style={{ padding: "5px 10px", borderRadius: 5, background: `${cfg.color}15`, border: `1px solid ${cfg.color}28`, color: cfg.color, fontFamily: "DM Mono, monospace", fontSize: "0.58rem", fontWeight: 700, cursor: "pointer" }}>Escalate</button>
                  )}
                  <button onClick={() => setDismissed(d => new Set([...d, alert.id]))} style={{ padding: "5px 10px", borderRadius: 5, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text3)", fontFamily: "DM Mono, monospace", fontSize: "0.58rem", cursor: "pointer" }}>Dismiss</button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", color: "var(--text)", marginBottom: 6 }}>No alerts to show</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>All systems nominal for the selected filter.</div>
          </div>
        )}
      </div>
    </>
  );
}
