"use client";
import { useAuth, roleLabels } from "@/app/context/AuthContext";
import Topbar from "@/app/components/Topbar";
import MinistryView from "@/app/components/views/MinistryView";
import DonorView from "@/app/components/views/DonorView";
import SchoolAdminView from "@/app/components/views/SchoolAdminView";
import ParentView from "@/app/components/views/ParentView";
import AuditorView from "@/app/components/views/AuditorView";

export default function DashboardHome() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const renderView = () => {
    switch (currentUser.role) {
      case "ministry":     return <MinistryView />;
      case "donor":        return <DonorView />;
      case "school_admin": return <SchoolAdminView />;
      case "parent":       return <ParentView />;
      case "auditor":      return <AuditorView />;
    }
  };

  return (
    <>
      <Topbar title="Dashboard" subtitle={`${roleLabels[currentUser.role]} · FY 2025–26`} />
      <div className="fade-in" key={currentUser.id}>{renderView()}</div>
    </>
  );
}
