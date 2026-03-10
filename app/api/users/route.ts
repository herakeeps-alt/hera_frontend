import { users } from "@/data/users";
export async function GET() { return Response.json(users); }
