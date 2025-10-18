import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import dbConnect from "@/lib/mongodb";
import GrandeCategorie from "@/models/GrandeCategorie";

// GET single grande catégorie
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const grandeCategorie = await GrandeCategorie.findById(id).lean();

    if (!grandeCategorie) {
      return NextResponse.json(
        { error: "Grande catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(grandeCategorie, { status: 200 });
  } catch (error) {
    console.error("Error fetching grande catégorie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la grande catégorie" },
      { status: 500 }
    );
  }
}

// PUT update grande catégorie (ADMIN only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    await dbConnect();

    const grandeCategorie = await GrandeCategorie.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!grandeCategorie) {
      return NextResponse.json(
        { error: "Grande catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(grandeCategorie, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating grande catégorie:", error);

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
      { error: "Erreur lors de la mise à jour de la grande catégorie" },
      { status: 500 }
    );
  }
}

// DELETE grande catégorie (ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();

    const grandeCategorie = await GrandeCategorie.findByIdAndDelete(id);

    if (!grandeCategorie) {
      return NextResponse.json(
        { error: "Grande catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Grande catégorie supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting grande catégorie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la grande catégorie" },
      { status: 500 }
    );
  }
}
