import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import dbConnect from "@/lib/mongodb";
import StructureType from "@/models/StructureType";

// GET all structure types
export async function GET() {
  try {
    await dbConnect();

    const types = await StructureType.find({})
      .sort({ ordre: 1, nom: 1 })
      .lean();

    return NextResponse.json(types, { status: 200 });
  } catch (error) {
    console.error("Error fetching structure types:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des types de structure" },
      { status: 500 }
    );
  }
}

// POST create new structure type (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    const type = await StructureType.create(body);

    return NextResponse.json(type, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating structure type:", error);

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
      { error: "Erreur lors de la création du type de structure" },
      { status: 500 }
    );
  }
}
