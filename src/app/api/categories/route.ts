import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { GrandeCategorie, Categorie } from "@/models";
import { auth } from "../../../../auth";

// GET /api/categories - Récupérer toutes les catégories (grandes + catégories)
export async function GET() {
  try {
    await connectDB();

    const grandesCategories = await GrandeCategorie.find().sort({ ordre: 1 });

    const categories = await Categorie.find()
      .populate("grandeCategorie")
      .sort({ ordre: 1 });

    return NextResponse.json({
      success: true,
      data: {
        grandesCategories,
        categories,
      },
    });
  } catch (error) {
    console.error("Erreur GET /api/categories:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Créer une catégorie ou grande catégorie
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
    const { type, ...data } = body; // type: 'grande' | 'categorie'

    let result;
    if (type === "grande") {
      result = await GrandeCategorie.create(data);
    } else {
      result = await Categorie.create(data);
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur POST /api/categories:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
