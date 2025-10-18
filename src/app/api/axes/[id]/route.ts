import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Axe } from "@/models";
import { auth } from "../../../../../auth";

// GET /api/axes/[id] - Récupérer un axe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const axe = await Axe.findById(id);

    if (!axe) {
      return NextResponse.json(
        { success: false, error: "Axe non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: axe });
  } catch (error) {
    console.error("Erreur GET /api/axes/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PATCH /api/axes/[id] - Mettre à jour un axe
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
    const axe = await Axe.findByIdAndUpdate(id, body, { new: true });

    if (!axe) {
      return NextResponse.json(
        { success: false, error: "Axe non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: axe });
  } catch (error: unknown) {
    console.error("Erreur PATCH /api/axes/[id]:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/axes/[id] - Supprimer un axe
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
    const axe = await Axe.findByIdAndDelete(id);

    if (!axe) {
      return NextResponse.json(
        { success: false, error: "Axe non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Axe supprimé avec succès",
    });
  } catch (error: unknown) {
    console.error("Erreur DELETE /api/axes/[id]:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
