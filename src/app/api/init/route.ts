import { NextResponse } from "next/server";
import { initializeRealData } from "@/scripts/initRealData";

async function doInit() {
  try {
    const result = await initializeRealData();
    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return doInit();
}

export async function POST() {
  return doInit();
}
