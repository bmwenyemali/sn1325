import { NextResponse } from "next/server";
import { initializeRealData } from "@/scripts/initRealData";

export async function POST() {
  try {
    console.log("🚀 Début de l'initialisation avec données réelles...");

    const result = await initializeRealData();

    return NextResponse.json({
      success: true,
      message: "Base de données initialisée avec données réelles SN1325",
      data: result,
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
