import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import dbConnect from "@/lib/mongodb";
import StructureType from "@/models/StructureType";

// GET single structure type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const type = await StructureType.findById(id).lean();

    if (!type) {
      return NextResponse.json(
        { error: "Type de structure non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(type, { status: 200 });
  } catch (error) {
    console.error("Error fetching structure type:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du type de structure" },
      { status: 500 }
    );
  }
}

// PUT update structure type (ADMIN only)
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

    const type = await StructureType.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!type) {
      return NextResponse.json(
        { error: "Type de structure non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(type, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating structure type:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Un type de structure avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du type de structure" },
      { status: 500 }
    );
  }
}

// DELETE structure type (ADMIN only)
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

    const type = await StructureType.findByIdAndDelete(id);

    if (!type) {
      return NextResponse.json(
        { error: "Type de structure non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Type de structure supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting structure type:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du type de structure" },
      { status: 500 }
    );
  }
}
