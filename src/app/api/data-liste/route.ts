import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import connectDB from "@/lib/db";
import DataQualitative from "@/models/DataQualitative";

export const dynamic = "force-dynamic";
export const revalidate = 30; // Cache for 30 seconds

// GET /api/data-liste - Get all qualitative data
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

    const query: Record<string, unknown> = {};
    if (indicateurId) query.indicateur = indicateurId;

    const dataQualitative = await DataQualitative.find(query)
      .populate("indicateur")
      .populate({
        path: "items.loisMesuresActions",
        populate: {
          path: "type",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: dataQualitative });
  } catch (error) {
    console.error("Error fetching qualitative data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des données qualitatives",
      },
      { status: 500 }
    );
  }
}

// POST /api/data-liste - Create new qualitative data
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
    const dataQualitative = await DataQualitative.create(body);

    const populatedData = await DataQualitative.findById(dataQualitative._id)
      .populate("indicateur")
      .populate({
        path: "items.loisMesuresActions",
        populate: {
          path: "type",
        },
      });

    return NextResponse.json(
      { success: true, data: populatedData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating qualitative data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création des données qualitatives",
      },
      { status: 500 }
    );
  }
}
