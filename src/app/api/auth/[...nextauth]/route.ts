import { NextRequest, NextResponse } from "next/server";

// Temporary simple authentication endpoint to allow build to pass
export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: "Auth endpoint - GET" });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({ message: "Auth endpoint - POST" });
}
