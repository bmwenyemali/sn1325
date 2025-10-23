import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import connectDB from "@/lib/db";
import Cible from "@/models/Cible";

// Cache for 30 seconds
export const revalidate = 30;

// GET /api/cibles - Get all cibles
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const categorieId = searchParams.get("categorie");
    const grandeCategorieId = searchParams.get("grandeCategorie");

    const query: Record<string, unknown> = {};
    if (categorieId) query.categorie = categorieId;
    if (grandeCategorieId) query.grandeCategorie = grandeCategorieId;

    const cibles = await Cible.find(query)
      .populate("categorie")
      .populate("grandeCategorie")
      .sort({ ordre: 1, nom: 1 });

    return NextResponse.json({ success: true, data: cibles });
  } catch (error) {
    console.error("Error fetching cibles:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des cibles" },
      { status: 500 }
    );
  }
}

// POST /api/cibles - Create a new cible
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const cible = await Cible.create(body);

    const populatedCible = await Cible.findById(cible._id)
      .populate("categorie")
      .populate("grandeCategorie");

    return NextResponse.json(
      { success: true, data: populatedCible },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating cible:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de la cible" },
      { status: 500 }
    );
  }
}
