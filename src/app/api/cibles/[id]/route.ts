import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import connectDB from "@/lib/db";
import Cible from "@/models/Cible";

// GET /api/cibles/[id] - Get single cible
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const cible = await Cible.findById(id)
      .populate("categorie")
      .populate("grandeCategorie");

    if (!cible) {
      return NextResponse.json(
        { success: false, error: "Cible non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cible });
  } catch (error) {
    console.error("Error fetching cible:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de la cible" },
      { status: 500 }
    );
  }
}

// PATCH /api/cibles/[id] - Update cible
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const cible = await Cible.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("categorie")
      .populate("grandeCategorie");

    if (!cible) {
      return NextResponse.json(
        { success: false, error: "Cible non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cible });
  } catch (error) {
    console.error("Error updating cible:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour de la cible" },
      { status: 500 }
    );
  }
}

// DELETE /api/cibles/[id] - Delete cible
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    const cible = await Cible.findByIdAndDelete(id);

    if (!cible) {
      return NextResponse.json(
        { success: false, error: "Cible non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cible });
  } catch (error) {
    console.error("Error deleting cible:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression de la cible" },
      { status: 500 }
    );
  }
}
