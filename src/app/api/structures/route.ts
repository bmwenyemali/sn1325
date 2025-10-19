import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Structure } from "@/models";
import { auth } from "../../../../auth";

// GET /api/structures - Récupérer toutes les structures
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const province = searchParams.get("province");
    const axe = searchParams.get("axe");

    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (province) query.provinces = province;
    if (axe) query.axes = axe;

    const structures = await Structure.find(query)
      .populate("provinces", "nom code")
      .populate("axes", "nom numero")
      .populate("cible", "nom numero")
      .sort({ nom: 1 });

    return NextResponse.json({ success: true, data: structures });
  } catch (error) {
    console.error("Erreur GET /api/structures:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/structures - Créer une nouvelle structure
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const structure = await Structure.create(body);

    return NextResponse.json(
      { success: true, data: structure },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Erreur POST /api/structures:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
