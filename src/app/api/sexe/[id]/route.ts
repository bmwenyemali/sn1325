import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";

// GET /api/sexe/[id] - Get single sexe option
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

    const { id } = await params;

    const sexeOptions: Record<
      string,
      {
        _id: string;
        nom: string;
        code: string;
        description: string;
        ordre: number;
      }
    > = {
      homme: {
        _id: "homme",
        nom: "Homme",
        code: "H",
        description: "Masculin",
        ordre: 1,
      },
      femme: {
        _id: "femme",
        nom: "Femme",
        code: "F",
        description: "Féminin",
        ordre: 2,
      },
      total: {
        _id: "total",
        nom: "Total",
        code: "T",
        description: "Total (Homme + Femme)",
        ordre: 3,
      },
    };

    const sexe = sexeOptions[id];

    if (!sexe) {
      return NextResponse.json(
        { success: false, error: "Option de sexe non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: sexe });
  } catch (error) {
    console.error("Error fetching sexe option:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération de l'option de sexe",
      },
      { status: 500 }
    );
  }
}
