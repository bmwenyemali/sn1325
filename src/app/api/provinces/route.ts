import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import connectDB from "@/lib/mongodb";
import { Province } from "@/models";

// GET /api/provinces - Récupérer toutes les provinces
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");

    let query = {};
    if (region) query = { region };

    const provinces = await Province.find(query).sort({ ordre: 1, nom: 1 });

    return NextResponse.json({ success: true, data: provinces });
  } catch (error) {
    console.error("Erreur GET /api/provinces:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/provinces - Create new province (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();

    const province = await Province.create(body);

    return NextResponse.json(
      { success: true, data: province },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating province:", error);

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
      { error: "Erreur lors de la création de la province" },
      { status: 500 }
    );
  }
}
