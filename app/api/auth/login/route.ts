import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try{
        const { email, password} = await req.json();

        if(!email || !password) {
            return NextResponse.json({message: "Email and password are required"}, {status: 400});
        }

        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!user) {
            return NextResponse.json({message: "Invalid email or password"}, {status: 401});
        }

        const isValid = await bcrypt.compare(password, user?.password);

        if(!isValid){
            return NextResponse.json({message: "Invalid email or password"}, {status: 401});
        }

        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET as string,
            {expiresIn: "7d"}
        );

        const response = NextResponse.json({user, token});

        return response;
    }catch {
        return NextResponse.json({message: "Something went wrong"}, {status:500});
    }
}