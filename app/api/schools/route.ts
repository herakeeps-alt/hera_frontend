import { schools } from "@/data/schools";
export async function GET() { return Response.json(schools); }
