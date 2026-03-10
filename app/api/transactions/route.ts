import { transactions } from "@/data/transactions";
export async function GET() { return Response.json(transactions); }
