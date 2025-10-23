import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import dbConnect from "@/lib/mongodb";
import Annee from "@/models/Annee";

// Cache for 30 seconds
export const revalidate = 30;

// GET all years
export async function GET() {
  try {
    await dbConnect();

    const annees = await Annee.find({})
      .sort({ annee: -1 }) // Most recent first
      .lean();

    return NextResponse.json(annees, { status: 200 });
  } catch (error) {
    console.error("Error fetching années:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des années" },
      { status: 500 }
    );
  }
}

// POST create new year (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    const annee = await Annee.create(body);

    return NextResponse.json(annee, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating année:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Cette année existe déjà" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de l'année" },
      { status: 500 }
    );
  }
}
