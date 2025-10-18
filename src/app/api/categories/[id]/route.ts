import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { GrandeCategorie, Categorie } from "@/models";
import { auth } from "../../../../../auth";

// GET /api/categories/[id] - Récupérer une catégorie
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Try grande catégorie first
    let item = await GrandeCategorie.findById(id).populate("axe");

    if (!item) {
      // Try catégorie
      item = await Categorie.findById(id)
        .populate("axe")
        .populate("grandeCategorie");
    }

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Erreur GET /api/categories/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/[id] - Mettre à jour une catégorie
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Try grande catégorie first
    let item = await GrandeCategorie.findByIdAndUpdate(id, body, { new: true });

    if (!item) {
      // Try catégorie
      item = await Categorie.findByIdAndUpdate(id, body, { new: true });
    }

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: unknown) {
    console.error("Erreur PATCH /api/categories/[id]:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    // Try grande catégorie first
    let item = await GrandeCategorie.findByIdAndDelete(id);

    if (!item) {
      // Try catégorie
      item = await Categorie.findByIdAndDelete(id);
    }

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Catégorie supprimée avec succès",
    });
  } catch (error: unknown) {
    console.error("Erreur DELETE /api/categories/[id]:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
