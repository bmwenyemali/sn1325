import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import connectDB from "@/lib/db";
import { SimpleData } from "@/models/SimpleData";

// GET /api/data-province - Get all province data
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
    const provinceId = searchParams.get("province");
    const axeId = searchParams.get("axe");
    const annee = searchParams.get("annee");
    const statut = searchParams.get("statut");

    const query: Record<string, unknown> = {};
    if (provinceId) query.provinceId = provinceId;
    if (axeId) query.axeId = axeId;
    if (annee) query.annee = parseInt(annee);
    if (statut) query.statut = statut;

    const simpleData = await SimpleData.find(query)
      .populate("axeId")
      .populate("indicateurId")
      .populate("provinceId")
      .populate("createdBy")
      .sort({ annee: -1, dateCreation: -1 });

    return NextResponse.json({ success: true, data: simpleData });
  } catch (error) {
    console.error("Error fetching province data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des données province",
      },
      { status: 500 }
    );
  }
}

// POST /api/data-province - Create new province data
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

    // Set createdBy if not provided
    if (!body.createdBy && session.user.id) {
      body.createdBy = session.user.id;
    }

    const simpleData = await SimpleData.create(body);

    const populatedData = await SimpleData.findById(simpleData._id)
      .populate("axeId")
      .populate("indicateurId")
      .populate("provinceId")
      .populate("createdBy");

    return NextResponse.json(
      { success: true, data: populatedData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating province data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création des données province",
      },
      { status: 500 }
    );
  }
}
