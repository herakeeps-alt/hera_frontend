"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) router.replace("/login");
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)" }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: "var(--text3)" }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar currentUser={currentUser} />
      <main style={{ marginLeft: 220, flex: 1, position: "relative", zIndex: 1, padding: "0 32px 40px" }}>
        {children}
      </main>
    </div>
  );
}
