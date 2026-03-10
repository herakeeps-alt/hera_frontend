"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, roleColors, roleLabels } from "@/app/context/AuthContext";
import { authApi, tokenStore } from "@/lib/api";

// Demo role credentials for the switcher
const demoCreds: Record<string, { email: string; password: string }> = {
  ministry:     { email: "grace.muthoni@education.go.ke", password: "ministry2026" },
  donor:        { email: "admin@greenfuture.org",         password: "donor2026" },
  school_admin: { email: "mary.wanjiku@kibera.sc.ke",     password: "school2026" },
  parent:       { email: "john.kamau@gmail.com",          password: "parent2026" },
  auditor:      { email: "auditor@oagkenya.go.ke",        password: "audit2026" },
};

const roles = ["ministry", "donor", "school_admin", "parent", "auditor"] as const;
const roleNames: Record<string, string> = {
  ministry: "Grace Muthoni", donor: "Green Future NGO",
  school_admin: "Mary Wanjiku", parent: "John Kamau", auditor: "Auditor General",
};
const roleIcons: Record<string, string> = {
  ministry: "🏛", donor: "💚", school_admin: "🏫", parent: "👨‍👩‍👧", auditor: "🔍",
};

export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { currentUser, login, logout } = useAuth();
  const [blockNum, setBlockNum] = useState(21847302);
  const [showPicker, setShowPicker] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setBlockNum(n => n + 1), 12000);
    return () => clearInterval(t);
  }, []);

  if (!currentUser) return null;
  const color = roleColors[currentUser.role];

  const switchRole = async (role: string) => {
    if (role === currentUser.role) { setShowPicker(false); return; }
    setSwitching(role);
    try {
      const creds = demoCreds[role];
      const tokens = await authApi.login(creds.email, creds.password);
      tokenStore.set(tokens);
      const me = await authApi.me();
      // Use AuthContext login flow
      await login(creds.email, creds.password);
    } catch {}
    setSwitching(null);
    setShowPicker(false);
    router.refresh();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 22px", borderBottom: "1px solid var(--border)", marginBottom: 26 }}>
      <div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.45rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.4px" }}>{title}</div>
        {subtitle && <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1.5 }}>{subtitle}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Live block counter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 12px", fontFamily: "DM Mono, monospace", fontSize: "0.64rem" }}>
          <span className="pulse-dot" style={{ width: 5, height: 5, background: "var(--green)", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ color: "var(--text3)" }}>BLOCK</span>
          <span style={{ color: "var(--gold2)", fontWeight: 500 }}>{blockNum.toLocaleString()}</span>
        </div>

        {/* Role switcher */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowPicker(p => !p)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 6, cursor: "pointer", background: "var(--surface)", border: `1px solid ${color}44`, color, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.7rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
            {currentUser.avatar} · {roleLabels[currentUser.role]} ▾
          </button>

          {showPicker && (
            <>
              <div onClick={() => setShowPicker(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 10, overflow: "hidden", zIndex: 100, minWidth: 240, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                <div style={{ padding: "10px 14px 6px", fontFamily: "DM Mono, monospace", fontSize: "0.54rem", color: "var(--text3)", letterSpacing: 1.5 }}>SWITCH DEMO ROLE</div>
                {roles.map(role => {
                  const c = roleColors[role];
                  const isCurrent = currentUser.role === role;
                  const isLoading = switching === role;
                  return (
                    <button key={role} onClick={() => switchRole(role)} disabled={!!switching}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: switching ? "wait" : "pointer", background: isCurrent ? `${c}10` : "transparent", border: "none", borderBottom: "1px solid rgba(30,40,64,0.5)", textAlign: "left" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${c}22`, border: `1px solid ${c}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", flexShrink: 0 }}>{roleIcons[role]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.73rem", fontWeight: 700, color: "var(--text)" }}>{roleNames[role]}</div>
                        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.54rem", color: c, marginTop: 1 }}>{roleLabels[role]}</div>
                      </div>
                      {isLoading ? <span style={{ fontSize: "0.6rem", color: "var(--text3)" }}>…</span> : isCurrent && <span style={{ color: c, fontSize: "0.6rem" }}>✓</span>}
                    </button>
                  );
                })}
                <div style={{ padding: 10, borderTop: "1px solid var(--border)" }}>
                  <button onClick={() => { logout(); router.push("/login"); setShowPicker(false); }} style={{ width: "100%", padding: "8px", borderRadius: 6, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--red)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", cursor: "pointer", fontWeight: 600 }}>← Sign Out</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
