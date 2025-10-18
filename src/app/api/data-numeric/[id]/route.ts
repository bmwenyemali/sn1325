import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import connectDB from "@/lib/db";
import DataNumeric from "@/models/DataNumeric";

// GET /api/data-numeric/[id] - Get single numeric data
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

    const dataNumeric = await DataNumeric.findById(id)
      .populate("indicateur")
      .populate("province")
      .populate("cible");

    if (!dataNumeric) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dataNumeric });
  } catch (error) {
    console.error("Error fetching numeric data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des données numériques",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/data-numeric/[id] - Update numeric data
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
    const dataNumeric = await DataNumeric.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("indicateur")
      .populate("province")
      .populate("cible");

    if (!dataNumeric) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dataNumeric });
  } catch (error) {
    console.error("Error updating numeric data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour des données numériques",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/data-numeric/[id] - Delete numeric data
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

    const dataNumeric = await DataNumeric.findByIdAndDelete(id);

    if (!dataNumeric) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dataNumeric });
  } catch (error) {
    console.error("Error deleting numeric data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression des données numériques",
      },
      { status: 500 }
    );
  }
}
