import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const user = await prisma.user.findMany();

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({message: "Something went wrong"});
    }
}