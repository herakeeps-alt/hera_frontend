"use client";
import { useAuth } from "@/app/context/AuthContext";
import { fundsApi, documentsApi, schoolsApi } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSpinner, ErrorBanner } from "@/app/components/ui";

function fmt(n: number) { return `KES ${n.toLocaleString()}`; }

export default function ParentView() {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id ?? "sch1";

  const { data: school, loading: sl, error: se, refetch: sr } = useApi(() => schoolsApi.get(schoolId), [schoolId]);
  const { data: funds, loading: fl } = useApi(() => fundsApi.list({ school_id: schoolId, status: "disbursed" }), [schoolId]);
  const { data: docs, loading: dl } = useApi(() => documentsApi.list({ school_id: schoolId, integrity: "verified" }), [schoolId]);

  if (sl || fl || dl) return <LoadingSpinner label="Loading school information…" />;
  if (se) return <ErrorBanner message={se} onRetry={sr} />;

  const mealsFund = (funds?.items ?? []).find(f => f.program.toLowerCase().includes("meal"));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)" }}>Your Child's School</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>{school?.name} · {school?.county}</div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#a78bfa,transparent)" }} />
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>🏫</div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)" }}>{school?.name}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 2 }}>{school?.county} · {school?.constituency}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {[{ label: "Students", value: school?.students.toLocaleString() ?? "—" }, { label: "Teachers", value: String(school?.teachers ?? "—") }, { label: "Programs", value: String(school?.programs?.length ?? "—") }].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>{value}</div>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", marginTop: 1 }}>{label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Funds Allocated to This School</div>
        {(funds?.items ?? []).map((f, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
              {f.program.toLowerCase().includes("meal") ? "🍽" : f.program.toLowerCase().includes("text") ? "📚" : "🏗"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)" }}>{f.program}</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 1 }}>From: {f.source} · {f.fund_date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.95rem", fontWeight: 600, color: "var(--green)" }}>{fmt(f.amount)}</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--green)", marginTop: 2 }}>✓ RECEIVED</div>
            </div>
          </div>
        ))}
      </div>

      {mealsFund && (
        <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: "1.2rem" }}>🍽</span>
            <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--green)" }}>School Meals Program — Active</div>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 1.6 }}>
            {fmt(mealsFund.amount)} has been allocated for the school meals program at {school?.name}. Funds are tracked on-chain ensuring full transparency.
          </div>
          <div style={{ marginTop: 12, height: 6, background: "rgba(52,211,153,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${school?.utilization ?? 0}%`, background: "var(--green)", borderRadius: 3 }} />
          </div>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 6 }}>{school?.utilization ?? 0}% of funds utilized</div>
        </div>
      )}

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.82rem" }}>Verified Receipts & Invoices</div>
        <div style={{ padding: "8px 20px 6px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)" }}>DOCUMENTS STORED ON IPFS · HASH VERIFIED ON BLOCKCHAIN</div>
        </div>
        {(docs?.items ?? []).map((doc, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
            <div style={{ width: 28, height: 28, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--text)" }}>{doc.name}</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", marginTop: 1 }}>{doc.doc_type.toUpperCase()} · {doc.upload_date}</div>
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--green)" }}>✓ Blockchain Verified</div>
          </div>
        ))}
      </div>
    </div>
  );
}
