'use client';

const schools = [
  { name: 'Pumwani Girls Secondary', loc: 'NAIROBI · ID: SCH-0042', amt: 'KES 1.2M', pct: 88, status: 'ok', emoji: '🏫', barColor: 'var(--green)', pctColor: 'var(--green)', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
  { name: 'Starehe Boys Centre', loc: 'NAIROBI · ID: SCH-0017', amt: 'KES 980K', pct: 95, status: 'ok', emoji: '🏫', barColor: 'var(--gold)', pctColor: 'var(--gold)', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.2)' },
  { name: 'Kisumu Day Secondary', loc: 'KISUMU · ID: SCH-0284', amt: 'KES 760K', pct: 60, status: 'ok', emoji: '🏫', barColor: 'var(--green)', pctColor: 'var(--text3)', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  { name: 'Kiambu Secondary School', loc: 'KIAMBU · ID: SCH-0119', amt: 'KES 545K', pct: 32, status: 'flag', emoji: '⚠', barColor: 'var(--red)', pctColor: 'var(--red)', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  { name: 'Mombasa Academy', loc: 'MOMBASA · ID: SCH-0388', amt: 'KES 430K', pct: 72, status: 'ok', emoji: '🏫', barColor: 'var(--green)', pctColor: 'var(--text2)', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
];

const docs = [
  { icon: '📄', name: 'alloc_riftval_q3.pdf', meta: 'ALLOCATION · 2.1 MB · Mar 1, 2025', hash: 'QmX4f…3b2c', flag: false },
  { icon: '🧾', name: 'receipt_q2_pump.pdf', meta: 'RECEIPT · 450 KB · Feb 28, 2025', hash: 'QmB9e…7a44', flag: false },
  { icon: '⚠', name: 'receipt_kiambu_feb.pdf', meta: 'HASH MISMATCH · Tamper Alert', hash: 'QmD2c…FAIL', flag: true },
  { icon: '📋', name: 'invoice_star_lab.pdf', meta: 'INVOICE · 820 KB · Feb 26, 2025', hash: 'Qm77a…f11b', flag: false },
  { icon: '📑', name: 'unicef_grant_2025.pdf', meta: 'GRANT AGREEMENT · 5.4 MB · Feb 20', hash: 'QmZ3d…9c80', flag: false },
];

export default function BottomPanels() {
  return (
    <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
      {/* Schools */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Top Schools by Disbursement</div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'var(--gold)', cursor: 'pointer' }}>All schools →</span>
        </div>
        {schools.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px',
            borderBottom: i < schools.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none',
            cursor: 'pointer', transition: 'background 0.12s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 32, height: 32, borderRadius: 6, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>{s.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>{s.name}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: 'var(--text3)', marginTop: 2 }}>{s.loc}</div>
              <div style={{ height: 3, background: 'var(--surface2)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: s.barColor, borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '0.88rem', fontWeight: 600 }}>{s.amt}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: s.pctColor, marginTop: 2 }}>
                {s.status === 'flag' ? 'FLAGGED' : `${s.pct}% utilized`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Off-chain Documents</div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'var(--gold)', cursor: 'pointer' }}>Browse IPFS →</span>
        </div>
        <div style={{ padding: '8px 20px 8px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'var(--text3)', letterSpacing: '1px' }}>IPFS / CRYPTOGRAPHIC HASH VERIFICATION</div>
        </div>
        <div style={{ flex: 1 }}>
          {docs.map((d, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
              borderBottom: i < docs.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none',
              borderLeft: d.flag ? '2px solid var(--red)' : '2px solid transparent',
              cursor: 'pointer', transition: 'background 0.12s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 28, height: 28, background: 'var(--surface2)', border: `1px solid ${d.flag ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>{d.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: d.flag ? 'var(--red)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: d.flag ? 'var(--red)' : 'var(--text3)', marginTop: 2 }}>{d.meta}</div>
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: d.flag ? 'var(--red)' : 'var(--gold)', flexShrink: 0 }}>{d.hash}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: '1px solid var(--border)' }}>
          <button style={{
            width: '100%', padding: '9px', borderRadius: 6,
            background: 'transparent', border: '1px solid var(--border2)',
            color: 'var(--text2)', fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--gold)'); (e.currentTarget.style.color = 'var(--gold)'); }}
            onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border2)'); (e.currentTarget.style.color = 'var(--text2)'); }}
          >
            + Upload &amp; Record Document Hash
          </button>
        </div>
      </div>
    </div>
  );
}
