import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Axe } from "@/models";
import { auth } from "../../../../auth";

// Cache for 30 seconds
export const revalidate = 30;

// GET /api/axes - Récupérer tous les axes
export async function GET() {
  try {
    await connectDB();
    const axes = await Axe.find().sort({ ordre: 1 });
    return NextResponse.json({ success: true, data: axes });
  } catch (error) {
    console.error("Erreur GET /api/axes:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/axes - Créer un nouvel axe
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const axe = await Axe.create(body);

    return NextResponse.json({ success: true, data: axe }, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur POST /api/axes:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
