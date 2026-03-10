import { documents } from "@/data/documents";
export async function GET() { return Response.json(documents); }
