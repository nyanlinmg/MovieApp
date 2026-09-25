import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyAuth(req: NextRequest) {
    const authorization = req.headers.get("authorization");
    const token = authorization?.split(" ")[1];

    if(!token){
        return {error: NextResponse.json({message: "Missing token"}, {status: 401})}
    }

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET as string);
        return {user};
    }catch{
        return {error: NextResponse.json({message: "Invalid token"}, {status: 401})}
    }
}