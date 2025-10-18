import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import connectDB from "@/lib/db";
import DataNumeric from "@/models/DataNumeric";

// GET /api/data-numeric - Get all numeric data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const indicateurId = searchParams.get("indicateur");
    const annee = searchParams.get("annee");
    const provinceId = searchParams.get("province");
    const sexe = searchParams.get("sexe");

    const query: Record<string, unknown> = {};
    if (indicateurId) query.indicateur = indicateurId;
    if (annee) query.annee = parseInt(annee);
    if (provinceId) query.province = provinceId;
    if (sexe) query.sexe = sexe;

    const dataNumeric = await DataNumeric.find(query)
      .populate("indicateur")
      .populate("province")
      .populate("cible")
      .sort({ annee: -1, createdAt: -1 });

    return NextResponse.json({ success: true, data: dataNumeric });
  } catch (error) {
    console.error("Error fetching numeric data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des données numériques",
      },
      { status: 500 }
    );
  }
}

// POST /api/data-numeric - Create new numeric data
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const dataNumeric = await DataNumeric.create(body);

    const populatedData = await DataNumeric.findById(dataNumeric._id)
      .populate("indicateur")
      .populate("province")
      .populate("cible");

    return NextResponse.json(
      { success: true, data: populatedData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating numeric data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création des données numériques",
      },
      { status: 500 }
    );
  }
}
