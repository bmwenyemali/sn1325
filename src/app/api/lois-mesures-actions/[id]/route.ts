import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { LoisMesuresActions } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const lma = await LoisMesuresActions.findById(id).populate("type");

    if (!lma) {
      return NextResponse.json(
        { error: "Loi/mesure/action non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(lma);
  } catch (error) {
    console.error("Erreur GET /api/lois-mesures-actions/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();

    const lma = await LoisMesuresActions.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate("type");

    if (!lma) {
      return NextResponse.json(
        { error: "Loi/mesure/action non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(lma);
  } catch (error) {
    console.error("Erreur PATCH /api/lois-mesures-actions/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const lma = await LoisMesuresActions.findByIdAndDelete(id);

    if (!lma) {
      return NextResponse.json(
        { error: "Loi/mesure/action non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Supprimé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE /api/lois-mesures-actions/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
