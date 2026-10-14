import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/services/tmdb";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const suggestions = await getSearchSuggestions(query);
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
