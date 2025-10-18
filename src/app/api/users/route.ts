import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { auth } from "../../../../auth";
import bcrypt from "bcryptjs";

// GET /api/users - Récupérer tous les utilisateurs
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    await connectDB();

    const users = await User.find()
      .select("-password")
      .populate("province")
      .sort({ dateCreation: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Erreur GET /api/users:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/users - Créer un nouvel utilisateur
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

    // Hash password
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const user = await User.create(body);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return NextResponse.json(
      { success: true, data: userObject },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Erreur POST /api/users:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
