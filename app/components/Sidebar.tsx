"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { roleColors, roleLabels } from "@/app/context/AuthContext";
import type { AuthUser } from "@/lib/api";

const navGroups = [
  { section: "Overview", items: [
    { icon: "⬡", label: "Dashboard",    href: "/dashboard" },
    { icon: "📊", label: "Fund Flows",   href: "/dashboard/funds" },
    { icon: "⛓", label: "Transactions", href: "/dashboard/transactions" },
  ]},
  { section: "Entities", items: [
    { icon: "🏫", label: "Schools",      href: "/dashboard/schools" },
    { icon: "🏛", label: "Donors & Gov", href: "/dashboard/donors" },
    { icon: "📄", label: "Documents",    href: "/dashboard/documents", badge: "3" },
  ]},
  { section: "System", items: [
    { icon: "🔔", label: "Alerts",       href: "/dashboard/alerts", badge: "2" },
  ]},
];

export default function Sidebar({ currentUser }: { currentUser: AuthUser }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();
  const color = roleColors[currentUser.role];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", zIndex: 10 }}>
      {/* Logo */}
      <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--gold2)", letterSpacing: "-0.5px", lineHeight: 1 }}>Hera Keeps</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", marginTop: 4 }}>Education Ledger</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 3, padding: "3px 8px", marginTop: 10, fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--gold)", letterSpacing: 1 }}>
          <span className="pulse-dot" style={{ width: 5, height: 5, background: "var(--green)", borderRadius: "50%", display: "inline-block" }} />
          ETH · Sepolia
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
        {navGroups.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: "2px", textTransform: "uppercase", padding: "0 12px", marginBottom: 6 }}>{section}</div>
            {items.map(({ icon, label, href, badge }: { icon: string; label: string; href: string; badge?: string }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 6, background: active ? `${color}15` : "transparent", border: `1px solid ${active ? color + "28" : "transparent"}`, color: active ? color : "var(--text2)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", position: "relative", transition: "all 0.15s", marginBottom: 2 }}
                    onMouseEnter={e => !active && ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={e => !active && ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    {active && <span style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, background: color, borderRadius: "0 2px 2px 0" }} />}
                    <span style={{ fontSize: "0.85rem" }}>{icon}</span>
                    <span style={{ flex: 1 }}>{label}</span>
                    {badge && <span style={{ background: "rgba(248,113,113,0.15)", color: "var(--red)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 3, fontFamily: "DM Mono, monospace", fontSize: "0.52rem", padding: "1px 5px" }}>{badge}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + sign out */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color, flexShrink: 0 }}>{currentUser.avatar ?? currentUser.full_name?.slice(0,2).toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.full_name}</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.54rem", color, marginTop: 1 }}>{roleLabels[currentUser.role].toUpperCase()}</div>
          </div>
        </div>
        <button onClick={() => { logout(); router.push("/login"); }}
          style={{ width: "100%", padding: "7px", borderRadius: 6, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", color: "var(--red)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", fontWeight: 600, cursor: "pointer", letterSpacing: 0.5 }}>
          ← Sign Out
        </button>
      </div>
    </aside>
  );
}
