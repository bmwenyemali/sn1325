import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import dbConnect from "@/lib/mongodb";
import Annee from "@/models/Annee";

// GET single year
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const annee = await Annee.findById(id).lean();

    if (!annee) {
      return NextResponse.json({ error: "Année non trouvée" }, { status: 404 });
    }

    return NextResponse.json(annee, { status: 200 });
  } catch (error) {
    console.error("Error fetching année:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'année" },
      { status: 500 }
    );
  }
}

// PUT update year (ADMIN only)
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

    const annee = await Annee.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!annee) {
      return NextResponse.json({ error: "Année non trouvée" }, { status: 404 });
    }

    return NextResponse.json(annee, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating année:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Cette année existe déjà" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'année" },
      { status: 500 }
    );
  }
}

// DELETE year (ADMIN only)
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

    const annee = await Annee.findByIdAndDelete(id);

    if (!annee) {
      return NextResponse.json({ error: "Année non trouvée" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Année supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting année:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'année" },
      { status: 500 }
    );
  }
}
