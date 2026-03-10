export interface Fund {
  id: string;
  source: string;
  sourceType: "government" | "ngo" | "private";
  program: string;
  amount: number;
  date: string;
  schoolId: string;
  status: "disbursed" | "pending" | "flagged";
  donorId?: string;
}

export const funds: Fund[] = [
  {
    id: "fund1",
    source: "Ministry of Education",
    sourceType: "government",
    program: "School Meals Program",
    amount: 500000,
    date: "2026-02-10",
    schoolId: "sch1",
    status: "disbursed",
  },
  {
    id: "fund2",
    source: "Green Future NGO",
    sourceType: "ngo",
    program: "Textbook Support",
    amount: 200000,
    date: "2026-02-12",
    schoolId: "sch2",
    status: "pending",
    donorId: "u2",
  },
  {
    id: "fund3",
    source: "Ministry of Education",
    sourceType: "government",
    program: "Digital Literacy",
    amount: 350000,
    date: "2026-02-15",
    schoolId: "sch2",
    status: "disbursed",
  },
  {
    id: "fund4",
    source: "UNICEF Kenya",
    sourceType: "ngo",
    program: "Sanitation & WASH",
    amount: 180000,
    date: "2026-02-18",
    schoolId: "sch1",
    status: "disbursed",
  },
  {
    id: "fund5",
    source: "Ministry of Education",
    sourceType: "government",
    program: "School Meals Program",
    amount: 420000,
    date: "2026-02-20",
    schoolId: "sch4",
    status: "flagged",
  },
  {
    id: "fund6",
    source: "Green Future NGO",
    sourceType: "ngo",
    program: "Lab Equipment",
    amount: 290000,
    date: "2026-02-22",
    schoolId: "sch3",
    status: "disbursed",
    donorId: "u2",
  },
  {
    id: "fund7",
    source: "KCB Foundation",
    sourceType: "private",
    program: "Bursaries",
    amount: 500000,
    date: "2026-02-25",
    schoolId: "sch6",
    status: "disbursed",
  },
  {
    id: "fund8",
    source: "Ministry of Education",
    sourceType: "government",
    program: "Infrastructure",
    amount: 650000,
    date: "2026-03-01",
    schoolId: "sch5",
    status: "pending",
  },
];
