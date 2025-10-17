import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/scripts/initDB";

export async function POST(request: NextRequest) {
  try {
    // Vérifier un token de sécurité simple pour éviter les initialisations accidentelles
    const { token } = await request.json();

    if (token !== "init-sn1325-2025") {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    await initializeDatabase();

    return NextResponse.json({
      success: true,
      message: "Base de données initialisée avec succès",
    });
  } catch (error) {
    console.error("Erreur initialisation DB:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'initialisation",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Endpoint d'initialisation de la base de données SN1325",
    usage: "POST avec token: init-sn1325-2025",
  });
}
