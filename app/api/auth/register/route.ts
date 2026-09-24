import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try{
        const {username, email, name, password, image} = await req.json();

        if(!username || !email || !name || !password) {
            return NextResponse.json({message: "Fill the required input...."}, {status: 400});
        }

        if(password.length < 8) {
            return NextResponse.json({message: "Password must be at least 8 characters"}, {status: 400});
        }

        const checkUser = await prisma.user.findUnique({
            where: {email}
        });
        
        if(checkUser) {
            return NextResponse.json({message: "Email is already in use"},{status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                image: image || null
            }
        });

        const response = NextResponse.json({newUser}, {status: 200});

        return response;
    }catch {
        return NextResponse.json({message: "something went wrong"}, {status: 500});
    }
}