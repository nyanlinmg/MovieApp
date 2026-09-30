import { MediaType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { user, error } = verifyAuth(req);

    if(error) return error;

    const { id: userId } = user as {id : number}
    const tmdbId = Number(req.nextUrl.searchParams.get("tmdbId"));
    const mediaType = req.nextUrl.searchParams.get("mediaType") as MediaType;

    const item = await prisma.watchlist.findFirst({
        where: { userId, tmdbId, mediaType}
    });

    return NextResponse.json({active: item !== null});
}

export async function POST(req: NextRequest) {
    const { user , error } = verifyAuth(req);

    if(error) return error;

    const { id: userId } = user as {id: number}
    const { tmdbId, mediaType } = await req.json();

    const item = await prisma.watchlist.findFirst({
        where: {userId, tmdbId, mediaType}
    });

    if(item) {
        await prisma.watchlist.delete({where: {id: item.id}});
        return NextResponse.json({active: false});
    }

    await prisma.watchlist.create({data: {userId, tmdbId, mediaType}});
    return NextResponse.json({active: true});
}