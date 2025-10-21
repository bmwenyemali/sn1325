import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { TypeLMA } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const types = await TypeLMA.find().sort({ nom: 1 }).lean();
    return NextResponse.json(types);
  } catch (error) {
    console.error("Erreur GET /api/type-lma:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des types" },
      { status: 500 }
    );
  }
}
