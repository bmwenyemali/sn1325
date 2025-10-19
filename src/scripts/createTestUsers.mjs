/**
 * Script to create test users in MongoDB
 * Run with: node src/scripts/createTestUsers.mjs
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// MongoDB URI - UPDATE THIS with your MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/sn1325"; // Default local MongoDB

// User Schema
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
    console.log("🔌 Connecting to MongoDB...");
    console.log("   URI:", MONGODB_URI.replace(/\/\/.*@/, "//***@")); // Hide password
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Delete all existing users
    console.log("🗑️  Deleting existing users...");
    const deleted = await User.deleteMany({});
    console.log(`✅ Deleted ${deleted.deletedCount} existing users`);

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
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin Portal:");
    console.log("  Email: carine@gmail.com");
    console.log("  Password: 12345");
    console.log("  Role: ADMIN");
    console.log("\nVisitor Portal:");
    console.log("  Email: ben@gmail.com");
    console.log("  Password: 12345");
    console.log("  Role: VISITOR");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    process.exit(1);
  }
}

// Run the script
createTestUsers();
