import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Structure } from "@/models";
import { auth } from "../../../../../auth";

// GET /api/structures/[id] - Récupérer une structure par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const structure = await Structure.findById(id)
      .populate("provinces")
      .populate("axes")
      .populate("cible");

    if (!structure) {
      return NextResponse.json(
        { success: false, error: "Structure non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: structure });
  } catch (error) {
    console.error("Erreur GET /api/structures/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PATCH /api/structures/[id] - Mettre à jour une structure
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

    const structure = await Structure.findByIdAndUpdate(
      id,
      { ...body, dateModification: new Date() },
      { new: true, runValidators: true }
    )
      .populate("provinces")
      .populate("axes")
      .populate("cible");

    if (!structure) {
      return NextResponse.json(
        { success: false, error: "Structure non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: structure });
  } catch (error: unknown) {
    console.error("Erreur PATCH /api/structures/[id]:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/structures/[id] - Supprimer une structure
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

    const structure = await Structure.findByIdAndDelete(id);

    if (!structure) {
      return NextResponse.json(
        { success: false, error: "Structure non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Structure supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur DELETE /api/structures/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
