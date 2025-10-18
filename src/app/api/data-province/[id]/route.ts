import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import connectDB from "@/lib/db";
import { SimpleData } from "@/models/SimpleData";

// GET /api/data-province/[id] - Get single province data
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

    const simpleData = await SimpleData.findById(id)
      .populate("axeId")
      .populate("indicateurId")
      .populate("provinceId")
      .populate("createdBy");

    if (!simpleData) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: simpleData });
  } catch (error) {
    console.error("Error fetching province data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des données province",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/data-province/[id] - Update province data
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
    body.dateModification = new Date();

    const simpleData = await SimpleData.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("axeId")
      .populate("indicateurId")
      .populate("provinceId")
      .populate("createdBy");

    if (!simpleData) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: simpleData });
  } catch (error) {
    console.error("Error updating province data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour des données province",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/data-province/[id] - Delete province data
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

    const simpleData = await SimpleData.findByIdAndDelete(id);

    if (!simpleData) {
      return NextResponse.json(
        { success: false, error: "Données non trouvées" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: simpleData });
  } catch (error) {
    console.error("Error deleting province data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression des données province",
      },
      { status: 500 }
    );
  }
}
