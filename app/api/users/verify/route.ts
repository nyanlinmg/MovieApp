import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        const {user: tokenUser, error} = verifyAuth(req);

        if(error) return error;

        try{
            const {id} = tokenUser as {id: number};

            const user = await prisma.user.findUnique({
                where: {id}
            });

            if(!user) {
                return NextResponse.json({message: "User not found"}, {status: 404});
            }

            return NextResponse.json(user);
        }catch {
            return NextResponse.json({message: "Something went wrong"}, {status: 500});

        }
    }catch {
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
}