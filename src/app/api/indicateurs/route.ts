import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Indicateur } from "@/models";
import { auth } from "../../../../auth";

// Cache for 30 seconds
export const revalidate = 30;

// GET /api/indicateurs - Récupérer tous les indicateurs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const axeId = searchParams.get("axe");
    const type = searchParams.get("type");

    let query = {};
    if (axeId) query = { ...query, axe: axeId };
    if (type) query = { ...query, type };

    const indicateurs = await Indicateur.find(query)
      .populate("axe")
      .sort({ ordre: 1 });

    return NextResponse.json({ success: true, data: indicateurs });
  } catch (error) {
    console.error("Erreur GET /api/indicateurs:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/indicateurs - Créer un nouvel indicateur
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const indicateur = await Indicateur.create(body);

    return NextResponse.json(
      { success: true, data: indicateur },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Erreur POST /api/indicateurs:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
