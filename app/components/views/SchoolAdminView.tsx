"use client";
import { useAuth } from "@/app/context/AuthContext";
import { fundsApi, documentsApi, transactionsApi, schoolsApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(2)}M`;
  return `KES ${(n / 1000).toFixed(0)}K`;
}

export default function SchoolAdminView() {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id ?? "sch1";

  const { data: schoolData, loading: sl, error: se, refetch: sr } = useApi(() => schoolsApi.get(schoolId), [schoolId]);
  const { data: funds, loading: fl } = useApi(() => fundsApi.list({ school_id: schoolId }), [schoolId]);
  const { data: docs, loading: dl } = useApi(() => documentsApi.list({ school_id: schoolId }), [schoolId]);

  if (sl || fl || dl) return <LoadingSpinner label="Loading school dashboard…" />;
  if (se) return <ErrorBanner message={se} onRetry={sr} />;

  const school = schoolData;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)" }}>{school?.name ?? "Your School"}</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>{school?.county} · {school?.students} Students · {school?.teachers} Teachers</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Funds Allocated", value: fmt(school?.allocated ?? 0), accent: "var(--gold)",  icon: "💰" },
          { label: "Funds Received",  value: fmt(school?.disbursed ?? 0),  accent: "var(--green)", icon: "✅" },
          { label: "Utilization",     value: `${school?.utilization ?? 0}%`, accent: "var(--blue)", icon: "📊" },
          { label: "Active Programs", value: String(school?.programs?.length ?? 0), accent: "#a78bfa", icon: "📚" },
        ].map(({ label, value, accent, icon }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)` }} />
            <div style={{ position: "absolute", right: 14, top: 14, fontSize: "1.3rem", opacity: 0.15 }}>{icon}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Active Programs</div>
          {(school?.programs ?? []).map((prog, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: "0.78rem", fontWeight: 600, color: "var(--text)" }}>{prog}</div>
              <span style={{ padding: "2px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.56rem", background: "rgba(52,211,153,0.1)", color: "var(--green)", border: "1px solid rgba(52,211,153,0.2)" }}>ACTIVE</span>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Funding Sources</div>
          {(funds?.items ?? []).map((f, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text)" }}>{f.source}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 1 }}>{f.program}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.88rem", fontWeight: 600 }}>{fmt(f.amount)}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", marginTop: 2, color: f.status === "disbursed" ? "var(--green)" : "var(--gold)" }}>{f.status.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>Uploaded Documents</div>
          <button style={{ padding: "6px 14px", borderRadius: 6, background: "var(--gold)", border: "none", color: "#0b0e14", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}>+ Upload New</button>
        </div>
        {(docs?.items ?? []).length === 0 ? (
          <div style={{ padding: "24px 20px", textAlign: "center", fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: "var(--text3)" }}>No documents uploaded yet.</div>
        ) : (docs?.items ?? []).map((doc, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
            <div style={{ width: 28, height: 28, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text)" }}>{doc.name}</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 1 }}>{doc.file_size} · {doc.upload_date}</div>
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--gold)" }}>{doc.ipfs_cid}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: doc.integrity_check === "verified" ? "var(--green)" : "var(--red)" }}>
              {doc.integrity_check === "verified" ? "✓ Verified" : "✗ Mismatch"}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 20 }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--gold)", letterSpacing: 1, marginBottom: 8 }}>PENDING ACTIONS</div>
        <div style={{ fontSize: "0.78rem", color: "var(--text2)" }}>2 transactions awaiting blockchain confirmation. Upload supporting receipts to proceed with Q2 disbursement.</div>
      </div>
    </div>
  );
}
