import { verifyAuth } from "@/middleware/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { user, error } = verifyAuth(req);

    if(error) return error;

    const userId = (user as any).id;
}