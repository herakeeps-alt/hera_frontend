"use client";
import { useState, useEffect } from "react";

const blocks = [
  { num: "21,847,302", txs: 4, time: "12s ago", latest: true },
  { num: "21,847,301", txs: 7, time: "24s ago", latest: false },
  { num: "21,847,300", txs: 2, time: "36s ago", latest: false },
  { num: "21,847,299", txs: 11, time: "48s ago", latest: false },
];

const alerts = [
  { type: "err", msg: <><strong style={{ color: "var(--text)" }}>Kiambu Secondary</strong> — Receipt hash mismatch. Document integrity check failed.</>, time: "2m" },
  { type: "warn", msg: <><strong style={{ color: "var(--text)" }}>Rift Valley Zone 3</strong> — Disbursement pending &gt;72h without confirmation.</>, time: "4h" },
  { type: "ok", msg: <><strong style={{ color: "var(--text)" }}>Nairobi County</strong> — Q2 audit complete. All 142 schools verified on-chain.</>, time: "1d" },
];

const dotColors: Record<string, string> = {
  err: "var(--red)",
  warn: "var(--amber)",
  ok: "var(--green)",
};

export default function BlockchainPanel() {
  const [blockNum, setBlockNum] = useState(21847302);

  useEffect(() => {
    const t = setInterval(() => setBlockNum(n => n + 1), 12000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      {/* Recent blocks */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>Recent Blocks</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)", cursor: "pointer" }}>Explorer →</div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "16px 20px", overflowX: "auto" }}>
        {blocks.map((b, i) => (
          <div key={i} style={{
            flexShrink: 0, width: 72,
            background: b.latest ? "var(--gold-dim)" : "var(--surface2)",
            border: `1px solid ${b.latest ? "var(--gold)" : "var(--border)"}`,
            borderRadius: 6, padding: "10px 8px", textAlign: "center", cursor: "pointer",
            position: "relative", transition: "all 0.15s",
          }}>
            {b.latest && (
              <span style={{
                position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)",
                background: "var(--gold)", color: "#0b0e14",
                fontFamily: "DM Mono, monospace", fontSize: "0.48rem", padding: "1px 5px", borderRadius: 2, fontWeight: 700,
              }}>NEW</span>
            )}
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--gold)" }}>
              {i === 0 ? `#${blockNum.toLocaleString()}` : `#${(blockNum - i).toLocaleString()}`}
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 4 }}>{b.txs} txs</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.5rem", color: "var(--text3)", marginTop: 3 }}>{b.time}</div>
          </div>
        ))}
      </div>

      {/* Network stats */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { label: "Network", val: "● Ethereum Sepolia", ok: true },
          { label: "Gas Price", val: "12.4 gwei", ok: false },
          { label: "Finality", val: "Confirmed", ok: true },
          { label: "Contract", val: "0x4f3a…c82e", gold: true },
          { label: "L2 Bridge", val: "⚡ Pending Setup", warn: true },
        ].map(({ label, val, ok, gold, warn }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid rgba(30,40,64,0.5)" }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.63rem", color: "var(--text2)" }}>{label}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: ok || warn ? "0.68rem" : "0.58rem", fontWeight: 500, color: ok ? "var(--green)" : warn ? "var(--amber)" : gold ? "var(--gold)" : "var(--text)" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ padding: "16px 20px 8px", fontWeight: 700, fontSize: "0.82rem" }}>System Alerts</div>
        {alerts.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "13px 20px", borderBottom: i < alerts.length - 1 ? "1px solid rgba(30,40,64,0.5)" : "none" }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 4,
              background: dotColors[a.type],
              boxShadow: a.type !== "ok" ? `0 0 6px ${dotColors[a.type]}55` : "none",
            }} />
            <div style={{ fontSize: "0.73rem", color: "var(--text2)", lineHeight: 1.4, flex: 1 }}>{a.msg}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", flexShrink: 0 }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
