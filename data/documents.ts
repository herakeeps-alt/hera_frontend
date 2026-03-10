export interface Document {
  id: string;
  name: string;
  type: "invoice" | "receipt" | "allocation" | "grant" | "audit";
  schoolId: string;
  hash: string;
  ipfsCid: string;
  uploadedBy: string;
  uploaderRole: string;
  date: string;
  fileSize: string;
  integrityCheck: "verified" | "mismatch" | "pending";
  txId?: string;
}

export const documents: Document[] = [
  {
    id: "doc1",
    name: "receipt_kibera_meals_feb.pdf",
    type: "receipt",
    schoolId: "sch1",
    hash: "0xa5f92c3a8d1e4b7f...",
    ipfsCid: "QmX4f3b2cK9pR7sT1u",
    uploadedBy: "Mary Wanjiku",
    uploaderRole: "school_admin",
    date: "2026-02-28",
    fileSize: "450 KB",
    integrityCheck: "verified",
    txId: "tx001",
  },
  {
    id: "doc2",
    name: "alloc_national_q1_2026.pdf",
    type: "allocation",
    schoolId: "",
    hash: "0xb2d83f1c9a7e6d4b...",
    ipfsCid: "QmB9e7a44L2mN8vW3x",
    uploadedBy: "Grace Muthoni",
    uploaderRole: "ministry",
    date: "2026-03-01",
    fileSize: "2.1 MB",
    integrityCheck: "verified",
    txId: "tx002",
  },
  {
    id: "doc3",
    name: "receipt_kiambu_infra_feb.pdf",
    type: "receipt",
    schoolId: "sch4",
    hash: "0xc9f14a2d7b3e8c1f...",
    ipfsCid: "QmD2cFAILx0xERR0R",
    uploadedBy: "Unknown",
    uploaderRole: "school_admin",
    date: "2026-02-25",
    fileSize: "820 KB",
    integrityCheck: "mismatch",
    txId: "tx003",
  },
  {
    id: "doc4",
    name: "invoice_langata_digital.pdf",
    type: "invoice",
    schoolId: "sch2",
    hash: "0xd7e25b3f8c1a9d4e...",
    ipfsCid: "Qm77af11bP4qS6tV2y",
    uploadedBy: "Langata Road Primary",
    uploaderRole: "school_admin",
    date: "2026-02-26",
    fileSize: "310 KB",
    integrityCheck: "verified",
    txId: "tx004",
  },
  {
    id: "doc5",
    name: "invoice_kisumu_lab.pdf",
    type: "invoice",
    schoolId: "sch3",
    hash: "0xe8f36c4g9d2b0e5f...",
    ipfsCid: "QmZ3d9c80Q5rU7wX4z",
    uploadedBy: "Green Future NGO",
    uploaderRole: "donor",
    date: "2026-02-24",
    fileSize: "670 KB",
    integrityCheck: "pending",
    txId: "tx005",
  },
  {
    id: "doc6",
    name: "grant_unicef_wash_2026.pdf",
    type: "grant",
    schoolId: "",
    hash: "0xf9g47d5h0e3c1f6g...",
    ipfsCid: "QmY5e0d91R6sV8xY5a",
    uploadedBy: "UNICEF Kenya",
    uploaderRole: "donor",
    date: "2026-02-20",
    fileSize: "5.4 MB",
    integrityCheck: "verified",
    txId: "tx006",
  },
  {
    id: "doc7",
    name: "receipt_nakuru_bursaries.pdf",
    type: "receipt",
    schoolId: "sch6",
    hash: "0xa1b2c3d4e5f6g7h8...",
    ipfsCid: "QmA1b2C3d4E5f6G7h8",
    uploadedBy: "Nakuru Girls High",
    uploaderRole: "school_admin",
    date: "2026-03-05",
    fileSize: "290 KB",
    integrityCheck: "verified",
    txId: "tx007",
  },
];
