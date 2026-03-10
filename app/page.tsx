"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function Root() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (currentUser) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [currentUser, isLoading, router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: "var(--text3)" }}>Loading…</div>
    </div>
  );
}
