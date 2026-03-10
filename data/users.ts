export type UserRole = "ministry" | "donor" | "school_admin" | "parent" | "auditor";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  organization?: string;
  schoolId?: string;
  childId?: string;
  avatar: string;
}

export const users: User[] = [
  {
    id: "u1",
    name: "Grace Muthoni",
    role: "ministry",
    organization: "Ministry of Education",
    avatar: "GM",
  },
  {
    id: "u2",
    name: "Green Future NGO",
    role: "donor",
    organization: "Green Future Foundation",
    avatar: "GF",
  },
  {
    id: "u3",
    name: "Mary Wanjiku",
    role: "school_admin",
    schoolId: "sch1",
    organization: "Kibera Primary School",
    avatar: "MW",
  },
  {
    id: "u4",
    name: "John Kamau",
    role: "parent",
    childId: "child1",
    schoolId: "sch1",
    organization: "Parent",
    avatar: "JK",
  },
  {
    id: "u5",
    name: "Auditor General",
    role: "auditor",
    organization: "Office of the Auditor General",
    avatar: "AG",
  },
];

export const roleLabels: Record<UserRole, string> = {
  ministry: "Ministry Officer",
  donor: "Donor / NGO",
  school_admin: "School Admin",
  parent: "Parent",
  auditor: "Auditor",
};

export const roleColors: Record<UserRole, string> = {
  ministry: "var(--blue)",
  donor: "var(--green)",
  school_admin: "var(--gold)",
  parent: "#a78bfa",
  auditor: "var(--red)",
};
