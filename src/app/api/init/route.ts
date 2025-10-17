import { NextRequest, NextResponse } from "next/server";
import { initializeRealData } from "@/scripts/initRealData";

export async function POST(request: NextRequest) {
  try {
    // Vérifier un token de sécurité simple pour éviter les initialisations accidentelles
    const { token } = await request.json();

    if (token !== "init-sn1325-2025") {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    console.log("🚀 Début de l'initialisation avec données réelles...");

    const result = await initializeRealData();

    return NextResponse.json({
      success: true,
      message: "Base de données initialisée avec données réelles",
      data: result.summary,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'initialisation de la base de données",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Endpoint d'initialisation de la base de données SN1325",
    instruction:
      "Utilisez POST avec token: 'init-sn1325-2025' pour initialiser avec données réelles",
  });
}
