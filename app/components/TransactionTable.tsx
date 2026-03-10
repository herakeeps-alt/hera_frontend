"use client";
import { useState } from "react";

const transactions = [
  { hash: "0x7f3d…a1b9", type: "disburse", typeLabel: "Disbursement", school: "Pumwani Girls Secondary", amount: "KES 420,000", doc: "receipt_q2_pump.pdf", integrity: "verified", time: "3 min ago" },
  { hash: "0x2c8e…f47a", type: "alloc", typeLabel: "Allocation", school: "Ministry of Education", amount: "KES 8,200,000", doc: "alloc_riftval_q3.pdf", integrity: "verified", time: "18 min ago" },
  { hash: "0xb14c…3390", type: "flag", typeLabel: "Flagged", school: "Kiambu Secondary School", amount: "KES 145,000", doc: "receipt_kiambu_feb.pdf", integrity: "mismatch", time: "2 hrs ago" },
  { hash: "0x9a1f…72dc", type: "receipt", typeLabel: "Receipt", school: "Starehe Boys Centre", amount: "KES 310,500", doc: "invoice_star_lab.pdf", integrity: "verified", time: "5 hrs ago" },
  { hash: "0x5e7b…dd21", type: "disburse", typeLabel: "Disbursement", school: "Kisumu Day Secondary", amount: "KES 560,000", doc: "disburse_kis_q2.pdf", integrity: "pending", time: "Yesterday" },
  { hash: "0x3d2a…8804", type: "alloc", typeLabel: "Allocation", school: "UNICEF Kenya", amount: "KES 15,000,000", doc: "unicef_grant_2025.pdf", integrity: "verified", time: "2 days ago" },
];

const tabs = ["All", "Allocations", "Disbursements", "Receipts", "Flagged"];

const typeStyle: Record<string, React.CSSProperties> = {
  alloc: { background: "rgba(96,165,250,0.1)", color: "var(--blue)", border: "1px solid rgba(96,165,250,0.2)" },
  disburse: { background: "rgba(52,211,153,0.1)", color: "var(--green)", border: "1px solid rgba(52,211,153,0.2)" },
  receipt: { background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" },
  flag: { background: "rgba(248,113,113,0.1)", color: "var(--red)", border: "1px solid rgba(248,113,113,0.2)" },
};

function IntegrityBadge({ status }: { status: string }) {
  if (status === "verified") return <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--green)" }}>✓ Verified</span>;
  if (status === "mismatch") return <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--red)" }}>✗ Hash Mismatch</span>;
  return <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)" }}>⏳ Pending</span>;
}

export default function TransactionTable() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilters, setActiveFilters] = useState<string[]>(["All Types"]);

  const filtered = transactions.filter(tx => {
    if (activeTab === "All") return true;
    if (activeTab === "Allocations") return tx.type === "alloc";
    if (activeTab === "Disbursements") return tx.type === "disburse";
    if (activeTab === "Receipts") return tx.type === "receipt";
    if (activeTab === "Flagged") return tx.type === "flag";
    return true;
  });

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text)" }}>Live Transaction Feed</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)", cursor: "pointer" }}>View all →</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, padding: "12px 16px 0", borderBottom: "1px solid var(--border)" }}>
        {tabs.map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "7px 14px", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer",
            borderRadius: "6px 6px 0 0",
            color: activeTab === tab ? "var(--gold2)" : "var(--text3)",
            background: activeTab === tab ? "var(--surface2)" : "transparent",
            border: activeTab === tab ? "1px solid var(--border)" : "1px solid transparent",
            borderBottom: activeTab === tab ? "1px solid var(--surface2)" : "1px solid transparent",
            marginBottom: activeTab === tab ? -1 : 0,
            transition: "all 0.12s",
          }}>{tab}</div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ color: "var(--text3)" }}>🔍</span>
        <input placeholder="Search by hash, school, or amount…" style={{
          flex: 1, background: "none", border: "none", outline: "none",
          color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.7rem",
        }} />
        {["All Types", "This Month", "Nairobi"].map(f => (
          <div key={f} onClick={() => setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])} style={{
            padding: "3px 8px", borderRadius: 4, cursor: "pointer",
            background: activeFilters.includes(f) ? "var(--gold-dim)" : "var(--surface2)",
            border: activeFilters.includes(f) ? "1px solid rgba(201,168,76,0.3)" : "1px solid var(--border)",
            fontFamily: "DM Mono, monospace", fontSize: "0.58rem",
            color: activeFilters.includes(f) ? "var(--gold)" : "var(--text2)",
          }}>{f}</div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["TX HASH", "TYPE", "SCHOOL / ENTITY", "AMOUNT", "DOCUMENT", "INTEGRITY", "TIME"].map(h => (
                <th key={h} style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", padding: "0 20px 10px", textAlign: "left", borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.hash} style={{ borderBottom: "1px solid rgba(30,40,64,0.5)", transition: "background 0.12s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.65rem", color: "var(--gold)", cursor: "pointer" }}>{tx.hash}</span>
                </td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ ...typeStyle[tx.type], display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 4, fontFamily: "DM Mono, monospace", fontSize: "0.6rem", fontWeight: 500 }}>
                    ● {tx.typeLabel}
                  </span>
                </td>
                <td style={{ padding: "13px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--text2)" }}>{tx.school}</td>
                <td style={{ padding: "13px 20px", fontFamily: "Fraunces, serif", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{tx.amount}</td>
                <td style={{ padding: "13px 20px", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: tx.integrity === "mismatch" ? "var(--red)" : "var(--text2)" }}>{tx.doc}</td>
                <td style={{ padding: "13px 20px" }}><IntegrityBadge status={tx.integrity} /></td>
                <td style={{ padding: "13px 20px", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
