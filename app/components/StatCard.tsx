"use client";

type Color = "gold" | "green" | "blue" | "red";

const colorMap: Record<Color, string> = {
  gold: "var(--gold)",
  green: "var(--green)",
  blue: "var(--blue)",
  red: "var(--red)",
};

export default function StatCard({
  label, value, unit, change, changeUp, icon, color,
}: {
  label: string; value: string; unit?: string; change: string;
  changeUp: boolean; icon: string; color: Color;
}) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: 20, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${colorMap[color]}, transparent)`,
      }} />
      <div style={{
        position: "absolute", right: 16, top: 16, fontSize: "1.4rem", opacity: 0.15,
      }}>{icon}</div>
      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "var(--text3)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.7rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.5px", lineHeight: 1 }}>
        {value}{unit && <span style={{ fontSize: "1rem", color: "var(--text2)", fontWeight: 300 }}>{unit}</span>}
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8,
        fontFamily: "DM Mono, monospace", fontSize: "0.62rem", fontWeight: 500,
        color: changeUp ? "var(--green)" : "var(--red)",
      }}>
        {changeUp ? "↑" : "↓"} {change}
      </div>
    </div>
  );
}
