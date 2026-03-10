import { funds } from "@/data/funds";
export async function GET() { return Response.json(funds); }
