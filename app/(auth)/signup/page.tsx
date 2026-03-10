"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, roleColors, roleLabels } from "@/app/context/AuthContext";
import { authApi, tokenStore } from "@/lib/api";
import type { UserRole } from "@/lib/api";

const roleIcons: Record<string, string> = {
  ministry: "🏛", donor: "💚", school_admin: "🏫", parent: "👨‍👩‍👧", auditor: "🔍",
};
const roleDescriptions: Record<string, string> = {
  ministry: "National funding oversight & allocation",
  donor: "Track impact of your contributions",
  school_admin: "Manage your school's funds & documents",
  parent: "Monitor funds at your child's school",
  auditor: "Full audit trail & compliance view",
};
const roles: UserRole[] = ["ministry", "donor", "school_admin", "parent", "auditor"];

export default function SignupPage() {
  const { loginAs } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("school_admin");
  const [form, setForm] = useState({ name: "", org: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const color = roleColors[selectedRole];

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setApiError("");
    try {
      const tokens = await authApi.register({
        email: form.email, password: form.password,
        full_name: form.name, role: selectedRole,
        organization: form.org || undefined,
      });
      tokenStore.set(tokens);
      const me = await authApi.me();
      loginAs(me);
      router.push("/dashboard");
    } catch (e: any) {
      setApiError(e.message ?? "Registration failed");
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: 1.2, textTransform: "uppercase", display: "block", marginBottom: 7 }}>{label}</label>
      <input type={type} placeholder={placeholder} value={(form as any)[name]}
        onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: "" })); }}
        style={{ width: "100%", padding: "11px 14px", background: "var(--surface)", border: `1px solid ${errors[name] ? "var(--red)" : "var(--border2)"}`, borderRadius: 8, color: "var(--text)", fontFamily: "DM Mono, monospace", fontSize: "0.72rem", outline: "none", boxSizing: "border-box" }}
        onFocus={e => (e.target.style.borderColor = color)}
        onBlur={e => (e.target.style.borderColor = errors[name] ? "var(--red)" : "var(--border2)")}
      />
      {errors[name] && <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: "var(--red)", marginTop: 5 }}>{errors[name]}</div>}
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Left panel */}
      <div style={{ width: "44%", flexShrink: 0, position: "relative", overflow: "hidden", background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "32px 32px", zIndex: 0 }} />
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${color}12 0%,transparent 70%)`, zIndex: 0, transition: "background 0.6s", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", padding: "52px 52px 48px" }}>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "2rem", fontWeight: 700, color: "var(--gold2)", letterSpacing: "-0.5px", lineHeight: 1 }}>Hera Keeps</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", letterSpacing: "3px", textTransform: "uppercase", marginTop: 6 }}>Education Funding Ledger</div>
          </div>

          <div style={{ marginTop: 60 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "2.2rem", fontWeight: 300, color: "var(--text)", lineHeight: 1.25, letterSpacing: "-0.5px" }}>
              Join the<br /><span style={{ color: "var(--gold2)" }}>transparency</span><br />movement.
            </div>
          </div>

          <div style={{ marginTop: 52 }}>
            {[{ icon: "📊", text: "Real-time fund flow dashboards" }, { icon: "⛓", text: "On-chain transaction verification" }, { icon: "📄", text: "IPFS document integrity checks" }, { icon: "🔔", text: "Automated alerts & audit trails" }].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: `${color}15`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>{icon}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text2)" }}>{text}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 48, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: "var(--text3)" }}>STEP {step} OF 2</div>
            <div style={{ flex: 1, height: 2, background: "var(--border)", borderRadius: 1, overflow: "hidden" }}>
              <div style={{ height: "100%", width: step === 1 ? "50%" : "100%", background: color, borderRadius: 1, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 64px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {step === 1 ? (
            <>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>Choose your role</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: 6, letterSpacing: 1 }}>THIS DETERMINES YOUR DASHBOARD VIEW</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {roles.map(role => {
                  const sel = selectedRole === role;
                  const c = roleColors[role];
                  return (
                    <button key={role} onClick={() => setSelectedRole(role)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, cursor: "pointer", background: sel ? `${c}10` : "var(--surface)", border: `1px solid ${sel ? c + "44" : "var(--border)"}`, transition: "all 0.15s", textAlign: "left", position: "relative" }}>
                      {sel && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "60%", background: c, borderRadius: "0 2px 2px 0" }} />}
                      <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{roleIcons[role]}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: sel ? c : "var(--text)" }}>{roleLabels[role]}</div>
                        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: sel ? c + "bb" : "var(--text3)", marginTop: 3 }}>{roleDescriptions[role]}</div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? c : "var(--border2)"}`, background: sel ? c : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {sel && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0b0e14" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setStep(2)} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", cursor: "pointer", background: color, color: "#0b0e14", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.5px" }}>
                Continue as {roleLabels[selectedRole]} →
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text3)", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", cursor: "pointer", padding: 0, marginBottom: 16 }}>← Back</button>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>Create account</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: "0.9rem" }}>{roleIcons[selectedRole]}</span>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color, letterSpacing: 1 }}>{roleLabels[selectedRole].toUpperCase()}</span>
                </div>
              </div>

              <Field label="Full Name" name="name" placeholder="e.g. Jane Mwangi" />
              <Field label="Organization / School (optional)" name="org" placeholder="e.g. Ministry of Education" />
              <Field label="Email Address" name="email" type="email" placeholder="you@example.com" />
              <Field label="Password" name="password" type="password" placeholder="Minimum 8 characters" />
              <Field label="Confirm Password" name="confirm" type="password" placeholder="Repeat password" />

              {apiError && <div style={{ padding: "9px 14px", borderRadius: 6, marginBottom: 14, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--red)" }}>{apiError}</div>}

              <button onClick={handleSignup} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "var(--border2)" : color, color: "#0b0e14", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? (<><span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid #0b0e1455", borderTopColor: "#0b0e14", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Creating account…</>) : "Create Account & Sign In"}
              </button>
            </>
          )}

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)" }}>Already have an account? </span>
            <Link href="/login" style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>Sign in →</Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
