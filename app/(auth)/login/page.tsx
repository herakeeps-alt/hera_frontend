"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, roleColors, roleLabels } from "@/app/context/AuthContext";

const roleIcons: Record<string, string> = {
  ministry: "🏛", donor: "💚", school_admin: "🏫", parent: "👨‍👩‍👧", auditor: "🔍",
};

type Role = "ministry" | "donor" | "school_admin" | "parent" | "auditor";
const demoCreds: Record<Role, { email: string; password: string }> = {
  ministry:     { email: "grace.muthoni@education.go.ke", password: "ministry2026" },
  donor:        { email: "admin@greenfuture.org",         password: "donor2026" },
  school_admin: { email: "mary.wanjiku@kibera.sc.ke",     password: "school2026" },
  parent:       { email: "john.kamau@gmail.com",          password: "parent2026" },
  auditor:      { email: "auditor@oagkenya.go.ke",        password: "audit2026" },
};

const roles: Role[] = ["ministry", "donor", "school_admin", "parent", "auditor"];
const roleNames: Record<Role, string> = {
  ministry: "Grace Muthoni", donor: "Green Future NGO",
  school_admin: "Mary Wanjiku", parent: "John Kamau", auditor: "Auditor General",
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("ministry");
  const [email, setEmail]       = useState(demoCreds["ministry"].email);
  const [password, setPassword] = useState(demoCreds["ministry"].password);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setEmail(demoCreds[role].email);
    setPassword(demoCreds[role].password);
    setError("");
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message ?? "Login failed. Check credentials.");
      setLoading(false);
    }
  };

  const color = roleColors[selectedRole];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Left brand panel ── */}
      <div style={{ width: "44%", flexShrink: 0, position: "relative", overflow: "hidden", background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "32px 32px", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle,${color}15 0%,transparent 70%)`, zIndex: 0, transition: "background 0.6s", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "linear-gradient(180deg,transparent,var(--gold)22,transparent)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", padding: "52px 52px 48px" }}>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", fontWeight: 700, color: "var(--gold2)", letterSpacing: "-0.5px", lineHeight: 1 }}>Hera Keeps</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", letterSpacing: "3px", textTransform: "uppercase", marginTop: 6 }}>Education Funding Ledger</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, padding: "4px 10px", marginTop: 14, fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--gold)" }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, background: "var(--green)", borderRadius: "50%", display: "inline-block" }} />
              Live · Ethereum Sepolia
            </div>
          </div>

          <div style={{ marginTop: 60 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "2.4rem", fontWeight: 300, color: "var(--text)", lineHeight: 1.2, letterSpacing: "-0.5px" }}>
              Every shilling,<br /><span style={{ color: "var(--gold2)" }}>traceable.</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: 20, lineHeight: 1.75, maxWidth: 340 }}>
              Blockchain-powered transparency for Kenya's education funding. Every allocation recorded on an immutable ledger — visible to all stakeholders.
            </div>
          </div>

          <div style={{ marginTop: 52, display: "flex", gap: 36 }}>
            {[{ label: "Schools", value: "847+" }, { label: "Funds Tracked", value: "KES 142M" }, { label: "On-chain Txns", value: "12,400+" }].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "var(--text3)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 52 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Latest Chain Activity</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[21847302, 21847301, 21847300, 21847299].map((b, i) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ padding: "6px 10px", borderRadius: 5, border: `1px solid ${i === 0 ? "rgba(201,168,76,0.3)" : "var(--border)"}`, background: i === 0 ? "var(--gold-dim)" : "var(--surface2)" }}>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.52rem", color: i === 0 ? "var(--gold2)" : "var(--text3)" }}>#{b.toLocaleString()}</div>
                  </div>
                  {i < 3 && <div style={{ width: 10, height: 1, background: "var(--border2)" }} />}
                </div>
              ))}
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)" }}>···</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 64px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>Welcome back</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 6, letterSpacing: 1 }}>SELECT YOUR ROLE TO CONTINUE</div>
          </div>

          {/* Role grid */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Access Level</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {roles.map(role => {
                const sel = selectedRole === role;
                const c = roleColors[role];
                return (
                  <button key={role} onClick={() => selectRole(role)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", background: sel ? `${c}12` : "var(--surface)", border: `1px solid ${sel ? c + "44" : "var(--border)"}`, transition: "all 0.15s", textAlign: "left" }}>
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{roleIcons[role]}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: sel ? c : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{roleNames[role]}</div>
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.54rem", color: sel ? c : "var(--text3)", marginTop: 1 }}>{roleLabels[role]}</div>
                    </div>
                    {sel && <span style={{ marginLeft: "auto", color: c, fontSize: "0.65rem", flexShrink: 0 }}>●</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "var(--text3)", letterSpacing: 1 }}>CREDENTIALS</div>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.2, textTransform: "uppercase", display: "block", marginBottom: 7 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "11px 14px", background: "var(--surface)", border: `1px solid ${error ? "var(--red)" : "var(--border2)"}`, borderRadius: 8, color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.72rem", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = color)}
              onBlur={e => (e.target.style.borderColor = error ? "var(--red)" : "var(--border2)")}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.2, textTransform: "uppercase", display: "block", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ width: "100%", padding: "11px 42px 11px 14px", background: "var(--surface)", border: `1px solid ${error ? "var(--red)" : "var(--border2)"}`, borderRadius: 8, color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.72rem", outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.target.style.borderColor = color)}
                onBlur={e => (e.target.style.borderColor = error ? "var(--red)" : "var(--border2)")}
              />
              <button onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}>{showPass ? "🙈" : "👁"}</button>
            </div>
          </div>

          {error && <div style={{ padding: "9px 14px", borderRadius: 6, marginBottom: 14, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--red)" }}>{error}</div>}

          <div style={{ padding: "9px 14px", borderRadius: 6, marginBottom: 18, background: `${color}08`, border: `1px solid ${color}22`, fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", lineHeight: 1.6 }}>
            <span style={{ color }}>Demo</span> — credentials auto-filled for <span style={{ color: "var(--text2)" }}>{roleLabels[selectedRole]}</span>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "var(--border2)" : color, color: "#0b0e14", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
            {loading ? (<><span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid #0b0e1455", borderTopColor: "#0b0e14", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Signing in…</>) : `Sign In as ${roleLabels[selectedRole]}`}
          </button>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>New to Hera Keeps? </span>
            <Link href="/signup" style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>Create an account →</Link>
          </div>

          <div style={{ marginTop: 28, textAlign: "center", fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "var(--text3)", lineHeight: 1.8 }}>
            Secured by Ethereum · IPFS document storage<br />© 2026 Hera Keeps
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
