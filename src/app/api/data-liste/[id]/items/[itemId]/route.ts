import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../../auth";
import connectDB from "@/lib/db";
import DataQualitative from "@/models/DataQualitative";
import LoisMesuresActions from "@/models/LoisMesuresActions";

// PATCH /api/data-liste/[id]/items/[itemId] - Update item in qualitative data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
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
    const { id, itemId } = await params;
    const body = await request.json();

    // Find or update the LMA reference
    let lma = await LoisMesuresActions.findOne({
      titre: body.lmaTitre,
      type: body.lmaType,
    });

    if (!lma) {
      lma = await LoisMesuresActions.create({
        titre: body.lmaTitre,
        type: body.lmaType,
        ordre: body.ordre || 0,
      });
    }

    // Update item in DataQualitative
    const dataQualitative = await DataQualitative.findById(id);

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    const itemIndex = dataQualitative.items.findIndex(
      (item: { _id: { toString: () => string } }) =>
        item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Item non trouvé" },
        { status: 404 }
      );
    }

    dataQualitative.items[itemIndex] = {
      ...dataQualitative.items[itemIndex],
      loisMesuresActions: lma._id,
      annee: body.annee,
      notes: body.notes || "",
    };

    await dataQualitative.save();

    const updatedData = await DataQualitative.findById(id)
      .populate("indicateur")
      .populate("items.loisMesuresActions");

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de l'item",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/data-liste/[id]/items/[itemId] - Delete item from qualitative data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
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
    const { id, itemId } = await params;

    const dataQualitative = await DataQualitative.findById(id);

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    dataQualitative.items = dataQualitative.items.filter(
      (item: { _id: { toString: () => string } }) =>
        item._id.toString() !== itemId
    );

    await dataQualitative.save();

    const updatedData = await DataQualitative.findById(id)
      .populate("indicateur")
      .populate("items.loisMesuresActions");

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'item",
      },
      { status: 500 }
    );
  }
}
