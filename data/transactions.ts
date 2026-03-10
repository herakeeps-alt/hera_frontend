export type TxType = "allocation" | "disbursement" | "receipt" | "flagged";
export type TxStatus = "confirmed" | "pending" | "failed";

export interface Transaction {
  id: string;
  hash: string;
  block: number;
  type: TxType;
  school: string;
  schoolId: string;
  amount: number;
  purpose: string;
  date: string;
  time: string;
  status: TxStatus;
  docId?: string;
  integrityCheck: "verified" | "mismatch" | "pending";
  gasUsed?: number;
}

export const transactions: Transaction[] = [
  {
    id: "tx001",
    hash: "0x7f3d9a1b…c82e",
    block: 21847302,
    type: "disbursement",
    school: "Kibera Primary School",
    schoolId: "sch1",
    amount: 500000,
    purpose: "School Meals Program",
    date: "2026-03-09",
    time: "3 min ago",
    status: "confirmed",
    docId: "doc1",
    integrityCheck: "verified",
    gasUsed: 42100,
  },
  {
    id: "tx002",
    hash: "0x2c8ef47a…3301",
    block: 21847290,
    type: "allocation",
    school: "Ministry of Education",
    schoolId: "",
    amount: 8200000,
    purpose: "Q1 2026 National Allocation",
    date: "2026-03-09",
    time: "18 min ago",
    status: "confirmed",
    docId: "doc2",
    integrityCheck: "verified",
    gasUsed: 38900,
  },
  {
    id: "tx003",
    hash: "0xb14c3390…f9a1",
    block: 21847201,
    type: "flagged",
    school: "Kiambu Secondary School",
    schoolId: "sch4",
    amount: 145000,
    purpose: "Infrastructure (Unverified)",
    date: "2026-03-09",
    time: "2 hrs ago",
    status: "pending",
    docId: "doc3",
    integrityCheck: "mismatch",
    gasUsed: 41200,
  },
  {
    id: "tx004",
    hash: "0x9a1f72dc…88b2",
    block: 21847150,
    type: "receipt",
    school: "Langata Road Primary",
    schoolId: "sch2",
    amount: 310500,
    purpose: "Digital Literacy Equipment",
    date: "2026-03-09",
    time: "5 hrs ago",
    status: "confirmed",
    docId: "doc4",
    integrityCheck: "verified",
    gasUsed: 39800,
  },
  {
    id: "tx005",
    hash: "0x5e7bdd21…1102",
    block: 21847100,
    type: "disbursement",
    school: "Kisumu Day Secondary",
    schoolId: "sch3",
    amount: 290000,
    purpose: "Lab Equipment",
    date: "2026-03-08",
    time: "Yesterday",
    status: "confirmed",
    docId: "doc5",
    integrityCheck: "pending",
    gasUsed: 40300,
  },
  {
    id: "tx006",
    hash: "0x3d2a8804…cc71",
    block: 21847010,
    type: "allocation",
    school: "UNICEF Kenya",
    schoolId: "",
    amount: 15000000,
    purpose: "WASH Program 2026",
    date: "2026-03-07",
    time: "2 days ago",
    status: "confirmed",
    docId: "doc6",
    integrityCheck: "verified",
    gasUsed: 37500,
  },
  {
    id: "tx007",
    hash: "0xa8c12fe0…d4b9",
    block: 21846900,
    type: "receipt",
    school: "Nakuru Girls High",
    schoolId: "sch6",
    amount: 500000,
    purpose: "Bursaries Disbursed",
    date: "2026-03-06",
    time: "3 days ago",
    status: "confirmed",
    docId: "doc7",
    integrityCheck: "verified",
    gasUsed: 41800,
  },
];
