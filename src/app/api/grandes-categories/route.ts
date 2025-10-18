import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import dbConnect from "@/lib/mongodb";
import GrandeCategorie from "@/models/GrandeCategorie";

// GET all grandes catégories
export async function GET() {
  try {
    await dbConnect();

    const grandesCategories = await GrandeCategorie.find({})
      .sort({ ordre: 1, nom: 1 })
      .lean();

    return NextResponse.json(grandesCategories, { status: 200 });
  } catch (error) {
    console.error("Error fetching grandes catégories:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des grandes catégories" },
      { status: 500 }
    );
  }
}

// POST create new grande catégorie (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    const grandeCategorie = await GrandeCategorie.create(body);

    return NextResponse.json(grandeCategorie, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating grande catégorie:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Une grande catégorie avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la grande catégorie" },
      { status: 500 }
    );
  }
}
