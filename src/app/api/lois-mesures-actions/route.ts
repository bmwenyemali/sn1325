import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { LoisMesuresActions } from "@/models";

export const dynamic = "force-dynamic";
export const revalidate = 30; // Cache for 30 seconds

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const statut = searchParams.get("statut");
    const annee = searchParams.get("annee");

    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (statut) query.statut = statut;
    if (annee) query.annee = parseInt(annee);

    const loisMesuresActions = await LoisMesuresActions.find(query)
      .populate("type", "nom") // Only fetch type name
      .sort({ annee: -1, nom: 1 })
      .lean(); // Already has lean(), good!

    return NextResponse.json(loisMesuresActions);
  } catch (error) {
    console.error("Erreur GET /api/lois-mesures-actions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des lois/mesures/actions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const lma = await LoisMesuresActions.create(body);
    const populated = await LoisMesuresActions.findById(lma._id).populate(
      "type"
    );

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/lois-mesures-actions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la loi/mesure/action" },
      { status: 500 }
    );
  }
}
