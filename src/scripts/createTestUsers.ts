/**
 * Script to create test users in MongoDB
 * Run with: npx tsx src/scripts/createTestUsers.ts
 * Make sure MONGODB_URI is set in .env.local
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema (minimal version for this script)
const UserSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "VISITOR"],
      default: "VISITOR",
      required: true,
    },
    statut: {
      type: String,
      enum: ["actif", "inactif", "suspendu"],
      default: "actif",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createTestUsers() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Delete all existing users
    console.log("🗑️  Deleting existing users...");
    await User.deleteMany({});
    console.log("✅ Existing users deleted");

    // Hash password
    const hashedPassword = await bcrypt.hash("12345", 10);

    // Create Admin user
    console.log("👤 Creating Admin user...");
    const adminUser = await User.create({
      nom: "Admin",
      prenom: "Carine",
      email: "carine@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      statut: "actif",
    });
    console.log("✅ Admin user created:", {
      email: adminUser.email,
      role: adminUser.role,
    });

    // Create Visitor user
    console.log("👤 Creating Visitor user...");
    const visitorUser = await User.create({
      nom: "User",
      prenom: "Ben",
      email: "ben@gmail.com",
      password: hashedPassword,
      role: "VISITOR",
      statut: "actif",
    });
    console.log("✅ Visitor user created:", {
      email: visitorUser.email,
      role: visitorUser.role,
    });

    console.log("\n✨ Test users created successfully!");
    console.log("\n📋 Login credentials:");
    console.log("Admin:");
    console.log("  Email: carine@gmail.com");
    console.log("  Password: 12345");
    console.log("  Role: ADMIN");
    console.log("\nVisitor:");
    console.log("  Email: ben@gmail.com");
    console.log("  Password: 12345");
    console.log("  Role: VISITOR");

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    process.exit(1);
  }
}

// Run the script
createTestUsers();
