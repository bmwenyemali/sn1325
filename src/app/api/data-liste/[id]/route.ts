import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import connectDB from "@/lib/db";
import DataQualitative from "@/models/DataQualitative";

// GET /api/data-liste/[id] - Get single qualitative data
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

    const dataQualitative = await DataQualitative.findById(id)
      .populate("indicateur")
      .populate("items.loisMesuresActions");

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dataQualitative });
  } catch (error) {
    console.error("Error fetching qualitative data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des données qualitatives",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/data-liste/[id] - Update qualitative data
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
    const dataQualitative = await DataQualitative.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("indicateur")
      .populate("items.loisMesuresActions");

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dataQualitative });
  } catch (error) {
    console.error("Error updating qualitative data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour des données qualitatives",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/data-liste/[id] - Delete qualitative data
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

    const dataQualitative = await DataQualitative.findByIdAndDelete(id);

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dataQualitative });
  } catch (error) {
    console.error("Error deleting qualitative data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression des données qualitatives",
      },
      { status: 500 }
    );
  }
}
