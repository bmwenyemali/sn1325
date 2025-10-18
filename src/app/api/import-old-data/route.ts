import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { importAllOldData } from "@/scripts/importOldData";

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier le rôle admin
    const userRole = session.user.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé. Réservé aux administrateurs." },
        { status: 403 }
      );
    }

    // Récupérer les options depuis le body
    const body = await request.json().catch(() => ({}));
    const clearExisting = body.clearExisting === true;

    // Lancer l'import
    console.log("🚀 Démarrage de l'import des données par", session.user.email);
    console.log("   Options: clearExisting =", clearExisting);
    const result = await importAllOldData(clearExisting);

    return NextResponse.json({
      success: true,
      message: "Import des données réalisé avec succès",
      data: result,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'import des données",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Utilisez POST pour lancer l'import des données",
    description:
      "Cet endpoint importe toutes les données depuis le dossier OldData vers MongoDB",
    auth: "Réservé aux administrateurs",
  });
}
