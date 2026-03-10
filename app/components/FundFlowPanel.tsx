'use client';

const months = [
  { label: 'Jul', pct: 55, color: 'var(--blue)' },
  { label: 'Aug', pct: 72, color: 'var(--blue)' },
  { label: 'Sep', pct: 48, color: 'var(--blue)' },
  { label: 'Oct', pct: 90, color: 'var(--gold)' },
  { label: 'Nov', pct: 63, color: 'var(--blue)' },
  { label: 'Dec', pct: 78, color: 'var(--blue)' },
  { label: 'Jan', pct: 44, color: 'var(--blue)' },
  { label: 'Feb', pct: 82, color: 'var(--green)' },
  { label: 'Mar', pct: 38, color: 'var(--green)', dim: true },
];

const sources = [
  { label: 'Gov Grants', pct: 78, val: 'KES 78.4M', color: 'var(--gold)' },
  { label: 'NGO Donors', pct: 45, val: 'KES 42.1M', color: 'var(--green)' },
  { label: 'Private Sector', pct: 24, val: 'KES 22.1M', color: 'var(--blue)' },
];

const blocks = [
  { num: '#21.8M', txs: 4, time: '12s ago', latest: true },
  { num: '#21.8M-1', txs: 7, time: '24s ago', latest: false },
  { num: '#21.8M-2', txs: 2, time: '36s ago', latest: false },
  { num: '#21.8M-3', txs: 11, time: '48s ago', latest: false },
];

const netStats = [
  { label: 'Network', val: '● Ethereum Sepolia', ok: true },
  { label: 'Gas Price', val: '12.4 gwei', ok: false },
  { label: 'Finality', val: 'Confirmed', ok: true },
  { label: 'Contract', val: '0x4f3a…c82e', gold: true },
  { label: 'L2 Bridge', val: '⚡ Pending Setup', warn: true },
];

const alerts = [
  { dot: 'err', msg: 'Kiambu Secondary — Receipt hash mismatch. Document integrity check failed.', bold: 'Kiambu Secondary', time: '2m' },
  { dot: 'warn', msg: 'Rift Valley Zone 3 — Disbursement pending >72h without confirmation.', bold: 'Rift Valley Zone 3', time: '4h' },
  { dot: 'ok', msg: 'Nairobi County — Q2 audit complete. All 142 schools verified on-chain.', bold: 'Nairobi County', time: '1d' },
];

function dotColor(d: string) {
  if (d === 'err') return { bg: 'var(--red)', shadow: '0 0 6px rgba(248,113,113,0.4)' };
  if (d === 'warn') return { bg: '#f59e0b', shadow: '0 0 6px rgba(245,158,11,0.4)' };
  return { bg: 'var(--green)', shadow: 'none' };
}

export default function FundFlowPanel() {
  return (
    <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 20 }}>
      {/* Left: Chart */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>Monthly Disbursements — FY 2024–25</div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'var(--gold)', cursor: 'pointer' }}>View full chart →</span>
        </div>

        {/* Bar chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: '20px 20px 10px', height: 140 }}>
          {months.map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
              <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  height: `${m.pct}%`,
                  background: m.color,
                  borderRadius: '3px 3px 0 0',
                  opacity: m.dim ? 0.45 : 1,
                  transition: 'height 0.8s cubic-bezier(.4,0,.2,1)',
                }} />
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.52rem', color: 'var(--text3)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Source bars */}
        <div style={{ padding: '16px 20px 20px', borderTop: '1px solid var(--border)' }}>
          {sources.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < sources.length - 1 ? 12 : 0 }}>
              <div style={{ width: 88, fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text2)', textAlign: 'right', flexShrink: 0 }}>{s.label}</div>
              <div style={{ flex: 1, height: 7, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 4 }} />
              </div>
              <div style={{ width: 72, fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text2)', flexShrink: 0 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Blocks + Network + Alerts */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Blocks */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Recent Blocks</div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'var(--gold)', cursor: 'pointer' }}>Explorer →</span>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '14px 20px', overflowX: 'auto' }}>
          {blocks.map((b, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 70,
              background: b.latest ? 'var(--gold-dim)' : 'var(--surface2)',
              border: `1px solid ${b.latest ? 'rgba(201,168,76,0.4)' : 'var(--border)'}`,
              borderRadius: 6, padding: '10px 8px', textAlign: 'center',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.15s',
            }}>
              {b.latest && (
                <div style={{
                  position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: '#0b0e14',
                  fontFamily: 'DM Mono, monospace', fontSize: '0.44rem',
                  padding: '1px 5px', borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap',
                }}>NEW</div>
              )}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'var(--gold)' }}>{b.num}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.54rem', color: 'var(--text3)', marginTop: 3 }}>{b.txs} txs</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.48rem', color: 'var(--text3)', marginTop: 2 }}>{b.time}</div>
            </div>
          ))}
        </div>

        {/* Network stats */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {netStats.map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 20px', borderBottom: i < netStats.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text2)' }}>{n.label}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', fontWeight: 500, color: n.ok ? 'var(--green)' : n.warn ? '#f59e0b' : n.gold ? 'var(--gold)' : 'var(--text)' }}>{n.val}</div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div style={{ borderTop: '1px solid var(--border)', flex: 1 }}>
          <div style={{ padding: '12px 20px 8px', fontWeight: 700, fontSize: '0.8rem' }}>System Alerts</div>
          {alerts.map((a, i) => {
            const dc = dotColor(a.dot);
            const parts = a.msg.split(a.bold);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 20px', borderBottom: i < alerts.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: dc.bg, boxShadow: dc.shadow, flexShrink: 0, marginTop: 4 }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text2)', lineHeight: 1.4, flex: 1 }}>
                  <strong style={{ color: 'var(--text)' }}>{a.bold}</strong>{parts[1]}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: 'var(--text3)', flexShrink: 0 }}>{a.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
