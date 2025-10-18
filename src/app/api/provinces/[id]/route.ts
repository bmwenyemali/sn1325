import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import dbConnect from "@/lib/mongodb";
import Province from "@/models/Province";

// GET single province
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const province = await Province.findById(id).lean();

    if (!province) {
      return NextResponse.json(
        { error: "Province non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: province },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching province:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la province" },
      { status: 500 }
    );
  }
}

// PUT update province (ADMIN only)
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

    const province = await Province.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!province) {
      return NextResponse.json(
        { error: "Province non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: province },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating province:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Cette province existe déjà" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la province" },
      { status: 500 }
    );
  }
}

// DELETE province (ADMIN only)
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

    const province = await Province.findByIdAndDelete(id);

    if (!province) {
      return NextResponse.json(
        { error: "Province non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Province supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting province:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la province" },
      { status: 500 }
    );
  }
}
