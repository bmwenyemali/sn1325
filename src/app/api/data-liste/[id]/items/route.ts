import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import connectDB from "@/lib/db";
import DataQualitative from "@/models/DataQualitative";
import LoisMesuresActions from "@/models/LoisMesuresActions";

// POST /api/data-liste/[id]/items - Add item to qualitative data
export async function POST(
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

    // Validate that the LMMA exists
    const lmaExists = await LoisMesuresActions.findById(
      body.loisMesuresActions
    );

    if (!lmaExists) {
      return NextResponse.json(
        { success: false, error: "Loi/Mesure/Action non trouvée" },
        { status: 404 }
      );
    }

    // Add item to DataQualitative
    const dataQualitative = await DataQualitative.findById(id);

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    dataQualitative.items.push({
      loisMesuresActions: body.loisMesuresActions,
      annee: body.annee,
      ordre: body.ordre || 0,
      notes: body.notes || "",
    });

    await dataQualitative.save();

    const updatedData = await DataQualitative.findById(id)
      .populate("indicateur")
      .populate("items.loisMesuresActions");

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'ajout de l'item",
      },
      { status: 500 }
    );
  }
}
