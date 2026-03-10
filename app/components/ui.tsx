export function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 20px", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--border2)", borderTopColor: "var(--gold)", animation: "spin 0.8s linear infinite" }} />
      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--text3)", letterSpacing: 1 }}>{label}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: "1.2rem" }}>⚠</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.65rem", color: "var(--red)", fontWeight: 700, marginBottom: 4 }}>Failed to load data</div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text2)" }}>{message}</div>
      </div>
      {onRetry && (
        <button onClick={onRetry} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--red)", fontFamily: "DM Mono, monospace", fontSize: "0.6rem", cursor: "pointer", fontWeight: 700 }}>
          Retry
        </button>
      )}
    </div>
  );
}
