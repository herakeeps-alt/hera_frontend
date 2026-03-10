'use client';
import { useState } from 'react';

const txTabs = ['All', 'Allocations', 'Disbursements', 'Receipts', 'Flagged'];
const chips = ['All Types', 'This Month', 'Nairobi'];

type TxType = 'disburse' | 'alloc' | 'receipt' | 'flag';

const transactions = [
  { hash: '0x7f3d…a1b9', type: 'disburse' as TxType, label: 'Disbursement', school: 'Pumwani Girls Secondary', amount: 'KES 420,000', doc: 'receipt_q2_pump.pdf', integrity: 'verified', time: '3 min ago' },
  { hash: '0x2c8e…f47a', type: 'alloc' as TxType, label: 'Allocation', school: 'Ministry of Education', amount: 'KES 8,200,000', doc: 'alloc_riftval_q3.pdf', integrity: 'verified', time: '18 min ago' },
  { hash: '0xb14c…3390', type: 'flag' as TxType, label: 'Flagged', school: 'Kiambu Secondary School', amount: 'KES 145,000', doc: 'receipt_kiambu_feb.pdf', integrity: 'mismatch', time: '2 hrs ago' },
  { hash: '0x9a1f…72dc', type: 'receipt' as TxType, label: 'Receipt', school: 'Starehe Boys Centre', amount: 'KES 310,500', doc: 'invoice_star_lab.pdf', integrity: 'verified', time: '5 hrs ago' },
  { hash: '0x5e7b…dd21', type: 'disburse' as TxType, label: 'Disbursement', school: 'Kisumu Day Secondary', amount: 'KES 560,000', doc: 'disburse_kis_q2.pdf', integrity: 'pending', time: 'Yesterday' },
  { hash: '0x3d2a…8804', type: 'alloc' as TxType, label: 'Allocation', school: 'UNICEF Kenya', amount: 'KES 15,000,000', doc: 'unicef_grant_2025.pdf', integrity: 'verified', time: '2 days ago' },
];

const typeStyles: Record<TxType, { bg: string; color: string; border: string }> = {
  disburse: { bg: 'rgba(52,211,153,0.1)', color: 'var(--green)', border: 'rgba(52,211,153,0.2)' },
  alloc: { bg: 'rgba(96,165,250,0.1)', color: 'var(--blue)', border: 'rgba(96,165,250,0.2)' },
  receipt: { bg: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: 'rgba(201,168,76,0.2)' },
  flag: { bg: 'rgba(248,113,113,0.1)', color: 'var(--red)', border: 'rgba(248,113,113,0.2)' },
};

function IntegrityBadge({ status }: { status: string }) {
  if (status === 'verified') return <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--green)' }}>✓ Verified</span>;
  if (status === 'mismatch') return <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--red)' }}>✗ Hash Mismatch</span>;
  return <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text3)' }}>⏳ Pending</span>;
}

export default function TransactionFeed() {
  const [activeTab, setActiveTab] = useState('All');
  const [activeChips, setActiveChips] = useState<string[]>(['All Types']);

  const toggleChip = (c: string) => setActiveChips(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <div className="fade-up-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Live Transaction Feed</div>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'var(--gold)', cursor: 'pointer' }}>View all →</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, padding: '12px 16px 0', borderBottom: '1px solid var(--border)' }}>
        {txTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '7px 14px', fontSize: '0.72rem', fontWeight: 600,
            fontFamily: 'Syne, sans-serif', cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            border: activeTab === tab ? '1px solid var(--border)' : '1px solid transparent',
            borderBottom: activeTab === tab ? '1px solid var(--surface)' : '1px solid transparent',
            background: activeTab === tab ? 'var(--surface2)' : 'transparent',
            color: activeTab === tab ? 'var(--gold2)' : 'var(--text3)',
            marginBottom: activeTab === tab ? -1 : 0,
            transition: 'all 0.12s',
          }}>{tab}</button>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>🔍</span>
        <input placeholder="Search by hash, school, or amount…" style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          color: 'var(--text)', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
        }} />
        {chips.map(c => (
          <button key={c} onClick={() => toggleChip(c)} style={{
            padding: '3px 9px', borderRadius: 4,
            background: activeChips.includes(c) ? 'var(--gold-dim)' : 'var(--surface2)',
            border: `1px solid ${activeChips.includes(c) ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
            color: activeChips.includes(c) ? 'var(--gold)' : 'var(--text2)',
            fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', cursor: 'pointer',
            fontWeight: activeChips.includes(c) ? 600 : 400,
          }}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['TX HASH', 'TYPE', 'SCHOOL / ENTITY', 'AMOUNT', 'DOCUMENT', 'INTEGRITY', 'TIME'].map(h => (
                <th key={h} style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: 'var(--text3)',
                  letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 20px 10px',
                  textAlign: 'left', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => {
              const ts = typeStyles[tx.type];
              return (
                <tr key={i} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.64rem', color: 'var(--gold)', cursor: 'pointer' }}>{tx.hash}</span>
                  </td>
                  <td style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 4, background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color, fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      ● {tx.label}
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text)' }}>{tx.school}</span>
                  </td>
                  <td style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: '0.9rem', fontWeight: 600 }}>{tx.amount}</span>
                  </td>
                  <td style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: tx.integrity === 'mismatch' ? 'var(--red)' : 'var(--text2)', whiteSpace: 'nowrap' }}>{tx.doc}</span>
                  </td>
                  <td style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                    <IntegrityBadge status={tx.integrity} />
                  </td>
                  <td style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(30,40,64,0.5)' : 'none' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{tx.time}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
