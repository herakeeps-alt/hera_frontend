'use client';

const stats = [
  { label: 'Total Allocated', value: 'KES', sub: '142.6M', change: '↑ 12.4% vs last FY', up: true, accent: 'var(--gold)', icon: '💰' },
  { label: 'Disbursed & Verified', value: 'KES', sub: '98.3M', change: '↑ 68.9% utilization', up: true, accent: 'var(--green)', icon: '✅' },
  { label: 'Schools On-chain', value: '847', sub: '', change: '↑ 23 added this month', up: true, accent: 'var(--blue)', icon: '🏫' },
  { label: 'Flagged Transactions', value: '14', sub: '', change: '↑ 2 new flags today', up: false, accent: 'var(--red)', icon: '⚠' },
];

export default function StatCards() {
  return (
    <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 20,
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          {/* top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />
          <div style={{ position: 'absolute', right: 16, top: 16, fontSize: '1.4rem', opacity: 0.15 }}>{s.icon}</div>

          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
            {s.label}
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.7rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {s.value} <span style={{ fontSize: '1rem', color: 'var(--text2)', fontWeight: 300 }}>{s.sub}</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginTop: 8,
            fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', fontWeight: 500,
            color: s.up ? 'var(--green)' : 'var(--red)',
          }}>
            {s.change}
          </div>
        </div>
      ))}
    </div>
  );
}
