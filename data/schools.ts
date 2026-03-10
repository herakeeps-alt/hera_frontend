export interface School {
  id: string;
  name: string;
  county: string;
  constituency: string;
  students: number;
  teachers: number;
  allocated: number;
  disbursed: number;
  utilization: number;
  status: "active" | "flagged" | "pending";
  programs: string[];
}

export const schools: School[] = [
  {
    id: "sch1",
    name: "Kibera Primary School",
    county: "Nairobi",
    constituency: "Kibera",
    students: 540,
    teachers: 18,
    allocated: 1200000,
    disbursed: 1056000,
    utilization: 88,
    status: "active",
    programs: ["School Meals", "Textbooks", "Sanitation"],
  },
  {
    id: "sch2",
    name: "Langata Road Primary",
    county: "Nairobi",
    constituency: "Langata",
    students: 430,
    teachers: 14,
    allocated: 980000,
    disbursed: 931000,
    utilization: 95,
    status: "active",
    programs: ["School Meals", "Digital Literacy"],
  },
  {
    id: "sch3",
    name: "Kisumu Day Secondary",
    county: "Kisumu",
    constituency: "Kisumu Central",
    students: 620,
    teachers: 22,
    allocated: 760000,
    disbursed: 456000,
    utilization: 60,
    status: "pending",
    programs: ["Textbooks", "Lab Equipment"],
  },
  {
    id: "sch4",
    name: "Kiambu Secondary School",
    county: "Kiambu",
    constituency: "Kiambu Town",
    students: 390,
    teachers: 16,
    allocated: 545000,
    disbursed: 174400,
    utilization: 32,
    status: "flagged",
    programs: ["School Meals", "Infrastructure"],
  },
  {
    id: "sch5",
    name: "Mombasa Academy",
    county: "Mombasa",
    constituency: "Mvita",
    students: 510,
    teachers: 19,
    allocated: 430000,
    disbursed: 309600,
    utilization: 72,
    status: "active",
    programs: ["Textbooks", "School Meals", "Sports"],
  },
  {
    id: "sch6",
    name: "Nakuru Girls High",
    county: "Nakuru",
    constituency: "Nakuru Town East",
    students: 480,
    teachers: 20,
    allocated: 870000,
    disbursed: 748200,
    utilization: 86,
    status: "active",
    programs: ["Textbooks", "Lab Equipment", "Bursaries"],
  },
];
