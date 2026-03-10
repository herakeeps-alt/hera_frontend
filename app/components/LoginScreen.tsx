"use client";
import { useState } from "react";
import { users, roleColors, roleLabels, type User } from "@/data/users";

const roleIcons: Record<string, string> = {
  ministry: "🏛",
  donor: "💚",
  school_admin: "🏫",
  parent: "👨‍👩‍👧",
  auditor: "🔍",
};

const roleDemoCredentials: Record<string, { email: string; password: string }> = {
  ministry: { email: "grace.muthoni@education.go.ke", password: "ministry2026" },
  donor: { email: "admin@greenfuture.org", password: "donor2026" },
  school_admin: { email: "mary.wanjiku@kibera.sc.ke", password: "school2026" },
  parent: { email: "john.kamau@gmail.com", password: "parent2026" },
  auditor: { email: "auditor@oagkenya.go.ke", password: "audit2026" },
};

export default function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [email, setEmail] = useState(roleDemoCredentials["ministry"].email);
  const [password, setPassword] = useState(roleDemoCredentials["ministry"].password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (user: User) => {
    setSelectedUser(user);
    const creds = roleDemoCredentials[user.role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
  };

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter your credentials.");
      return;
    }
    const creds = roleDemoCredentials[selectedUser.role];
    if (email !== creds.email || password !== creds.password) {
      setError("Invalid credentials. Use the demo credentials shown.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onLogin(selectedUser);
  };

  const color = roleColors[selectedUser.role];

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: "var(--bg)",
    }}>
      {/* Left — brand panel */}
      <div style={{
        width: "45%", flexShrink: 0,
        position: "relative", overflow: "hidden",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        padding: "0 0 48px 0",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }} />

        {/* Radial glow */}
        <div style={{
          position: "absolute", bottom: -100, left: -100,
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          zIndex: 0, transition: "background 0.5s",
          pointerEvents: "none",
        }} />

        {/* Geometric accent lines */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "linear-gradient(180deg, transparent, var(--gold)22, transparent)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--border2), transparent)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", padding: "48px 52px" }}>
          {/* Logo */}
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.9rem", fontWeight: 700, color: "var(--gold2)", letterSpacing: "-0.5px", lineHeight: 1 }}>
              Hera Keeps
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", letterSpacing: "3px", textTransform: "uppercase", marginTop: 6 }}>
              Education Funding Ledger
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 4, padding: "4px 10px", marginTop: 14,
              fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--gold)", letterSpacing: 1,
            }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, background: "var(--green)", borderRadius: "50%", display: "inline-block" }} />
              Live · Ethereum Sepolia
            </div>
          </div>

          {/* Tagline */}
          <div style={{ marginTop: 56 }}>
            <div style={{
              fontFamily: "Fraunces, serif", fontStyle: "italic",
              fontSize: "2.2rem", fontWeight: 300, color: "var(--text)",
              lineHeight: 1.25, letterSpacing: "-0.5px",
            }}>
              Every shilling,<br />
              <span style={{ color: "var(--gold2)" }}>traceable.</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: 20, lineHeight: 1.7, maxWidth: 340 }}>
              Blockchain-powered transparency for Kenya's education funding. From donor to student — every allocation, disbursement, and receipt recorded on an immutable ledger.
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ marginTop: 52, display: "flex", gap: 32 }}>
            {[
              { label: "Schools", value: "847+" },
              { label: "Funds Tracked", value: "KES 142M" },
              { label: "Transactions", value: "12,400+" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.35rem", fontWeight: 600, color: "var(--text)", lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Chain visualization */}
          <div style={{ marginTop: "auto", paddingTop: 48 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Latest Block Activity</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[21847302, 21847301, 21847300, 21847299].map((block, i) => (
                <div key={block} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    padding: "6px 10px", borderRadius: 5, border: "1px solid var(--border2)",
                    background: i === 0 ? "var(--gold-dim)" : "var(--surface2)",
                    borderColor: i === 0 ? "rgba(201,168,76,0.3)" : "var(--border)",
                  }}>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.52rem", color: i === 0 ? "var(--gold2)" : "var(--text3)" }}>#{block.toLocaleString()}</div>
                  </div>
                  {i < 3 && <div style={{ width: 12, height: 1, background: "var(--border2)" }} />}
                </div>
              ))}
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)" }}>···</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 64px", position: "relative",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>
              Sign in
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 6, letterSpacing: 1 }}>
              SELECT YOUR ROLE TO CONTINUE
            </div>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Access Level</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {users.map(u => {
                const isSelected = selectedUser.id === u.id;
                const c = roleColors[u.role];
                return (
                  <button key={u.id} onClick={() => handleRoleSelect(u)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    background: isSelected ? `${c}12` : "var(--surface)",
                    border: `1px solid ${isSelected ? c + "44" : "var(--border)"}`,
                    transition: "all 0.15s", textAlign: "left",
                  }}
                    onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = "var(--border2)")}
                    onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{roleIcons[u.role]}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: isSelected ? c : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.54rem", color: isSelected ? c : "var(--text3)", marginTop: 1 }}>{roleLabels[u.role]}</div>
                    </div>
                    {isSelected && <span style={{ marginLeft: "auto", color: c, fontSize: "0.65rem", flexShrink: 0 }}>●</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", letterSpacing: 1 }}>CREDENTIALS</div>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Email field */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.2, textTransform: "uppercase", display: "block", marginBottom: 7 }}>Email</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "var(--surface)", border: `1px solid ${error ? "var(--red)" : "var(--border2)"}`,
                  borderRadius: 8, color: "var(--text)",
                  fontFamily: "DM Mono, monospace", fontSize: "0.72rem",
                  outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={e => (e.target.style.borderColor = color)}
                onBlur={e => (e.target.style.borderColor = error ? "var(--red)" : "var(--border2)")}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.2, textTransform: "uppercase", display: "block", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "11px 42px 11px 14px",
                  background: "var(--surface)", border: `1px solid ${error ? "var(--red)" : "var(--border2)"}`,
                  borderRadius: 8, color: "var(--text)",
                  fontFamily: "DM Mono, monospace", fontSize: "0.72rem",
                  outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={e => (e.target.style.borderColor = color)}
                onBlur={e => (e.target.style.borderColor = error ? "var(--red)" : "var(--border2)")}
              />
              <button
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "var(--text3)", cursor: "pointer",
                  fontSize: "0.75rem", padding: 0,
                }}
              >{showPassword ? "🙈" : "👁"}</button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "9px 14px", borderRadius: 6, marginBottom: 16,
              background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
              fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--red)",
            }}>{error}</div>
          )}

          {/* Demo hint */}
          <div style={{
            padding: "9px 14px", borderRadius: 6, marginBottom: 20,
            background: `${color}08`, border: `1px solid ${color}22`,
            fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", lineHeight: 1.6,
          }}>
            <span style={{ color }}>Demo mode</span> — credentials auto-filled for <span style={{ color: "var(--text2)" }}>{roleLabels[selectedUser.role]}</span>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "var(--border2)" : color,
              color: loading ? "var(--text3)" : "#0b0e14",
              fontFamily: "Syne, sans-serif", fontWeight: 800,
              fontSize: "0.82rem", letterSpacing: "0.5px",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  border: "2px solid var(--text3)", borderTopColor: "var(--text2)",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Verifying on-chain…
              </>
            ) : (
              <>Sign In as {roleLabels[selectedUser.role]}</>
            )}
          </button>

          {/* Footer */}
          <div style={{ marginTop: 28, textAlign: "center", fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)", lineHeight: 1.8 }}>
            Secured by Ethereum · IPFS document storage<br />
            <span style={{ color: "var(--text3)" }}>© 2026 Hera Keeps · Education Funding Transparency</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
