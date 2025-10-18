import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Indicateur } from "@/models";
import { auth } from "../../../../../auth";

// GET /api/indicateurs/[id] - Récupérer un indicateur par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const indicateur = await Indicateur.findById(id).populate("axe");

    if (!indicateur) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: indicateur });
  } catch (error) {
    console.error("Erreur GET /api/indicateurs/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PATCH /api/indicateurs/[id] - Mettre à jour un indicateur
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

    const indicateur = await Indicateur.findByIdAndUpdate(
      id,
      { ...body, dateModification: new Date() },
      { new: true, runValidators: true }
    ).populate("axe");

    if (!indicateur) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: indicateur });
  } catch (error: unknown) {
    console.error("Erreur PATCH /api/indicateurs/[id]:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/indicateurs/[id] - Supprimer un indicateur
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

    const indicateur = await Indicateur.findByIdAndDelete(id);

    if (!indicateur) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Indicateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur DELETE /api/indicateurs/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
