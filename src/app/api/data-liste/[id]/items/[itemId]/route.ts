import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../../auth";
import connectDB from "@/lib/db";
import DataQualitative from "@/models/DataQualitative";

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

    console.log("PATCH item - id:", id, "itemId:", itemId);

    // Update item in DataQualitative
    const dataQualitative = await DataQualitative.findById(id);

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    console.log(
      "Items:",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataQualitative.items.map((item: any, idx: number) => ({
        index: idx,
        _id: item._id?.toString(),
      }))
    );

    let itemIndex = -1;

    // Check if itemId is an index-based identifier (for old items without _id)
    if (itemId.startsWith("index-")) {
      itemIndex = parseInt(itemId.replace("index-", ""));
      console.log("Using index-based update, index:", itemIndex);
      if (itemIndex < 0 || itemIndex >= dataQualitative.items.length) {
        return NextResponse.json(
          { success: false, error: "Item non trouvé (index invalide)" },
          { status: 404 }
        );
      }
    } else {
      // Use _id for new items
      console.log("Using _id-based update");
      itemIndex = dataQualitative.items.findIndex(
        (item: { _id?: { toString: () => string } }) => {
          const itemIdStr = item._id?.toString();
          console.log("Comparing:", itemIdStr, "with", itemId);
          return item._id && itemIdStr === itemId;
        }
      );

      console.log("Found at index:", itemIndex);

      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, error: "Item non trouvé (_id not matched)" },
          { status: 404 }
        );
      }
    }

    // Update the item with new values
    dataQualitative.items[itemIndex] = {
      ...dataQualitative.items[itemIndex],
      loisMesuresActions: body.loisMesuresActions,
      annee: body.annee,
      ordre: body.ordre,
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

    console.log("DELETE item - id:", id, "itemId:", itemId);

    const dataQualitative = await DataQualitative.findById(id);

    if (!dataQualitative) {
      return NextResponse.json(
        { success: false, error: "Indicateur non trouvé" },
        { status: 404 }
      );
    }

    console.log("Items before delete:", dataQualitative.items.length);
    console.log(
      "Items ids:",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataQualitative.items.map((item: any) => ({
        _id: item._id?.toString(),
        lmma: item.loisMesuresActions?.toString(),
      }))
    );

    // Check if itemId is an index-based identifier (for old items without _id)
    if (itemId.startsWith("index-")) {
      const index = parseInt(itemId.replace("index-", ""));
      console.log("Using index-based delete, index:", index);
      if (index >= 0 && index < dataQualitative.items.length) {
        dataQualitative.items.splice(index, 1);
      } else {
        console.log("Index out of bounds");
        return NextResponse.json(
          { success: false, error: "Item non trouvé (index invalide)" },
          { status: 404 }
        );
      }
    } else {
      // Use _id for new items
      console.log("Using _id-based delete");
      const initialLength = dataQualitative.items.length;
      dataQualitative.items = dataQualitative.items.filter(
        (item: { _id?: { toString: () => string } }) => {
          const itemIdStr = item._id?.toString();
          console.log("Comparing:", itemIdStr, "with", itemId);
          return itemIdStr !== itemId;
        }
      );

      console.log("Items after filter:", dataQualitative.items.length);

      if (dataQualitative.items.length === initialLength) {
        return NextResponse.json(
          { success: false, error: "Item non trouvé (_id not matched)" },
          { status: 404 }
        );
      }
    }

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
