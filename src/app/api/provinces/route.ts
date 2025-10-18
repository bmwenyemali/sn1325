import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Province } from "@/models";

// GET /api/provinces - Récupérer toutes les provinces
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");

    let query = {};
    if (region) query = { region };

    const provinces = await Province.find(query).sort({ nom: 1 });

    return NextResponse.json({ success: true, data: provinces });
  } catch (error) {
    console.error("Erreur GET /api/provinces:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
