import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

// GET /api/sexe - Get all sexe options (static referential)
export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Static referential for sex/gender categories
    const sexeOptions = [
      {
        _id: "homme",
        nom: "Homme",
        code: "H",
        description: "Masculin",
        ordre: 1,
      },
      {
        _id: "femme",
        nom: "Femme",
        code: "F",
        description: "Féminin",
        ordre: 2,
      },
      {
        _id: "total",
        nom: "Total",
        code: "T",
        description: "Total (Homme + Femme)",
        ordre: 3,
      },
    ];

    return NextResponse.json({ success: true, data: sexeOptions });
  } catch (error) {
    console.error("Error fetching sexe options:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des options de sexe",
      },
      { status: 500 }
    );
  }
}
