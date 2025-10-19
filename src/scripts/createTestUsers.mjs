import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ⚠️ IMPORTANT: Always use environment variables for database credentials
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI environment variable is not set");
  console.log("Please set MONGODB_URI in your .env.local file");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  province: { type: mongoose.Schema.Types.ObjectId, ref: "Province" },
  createdAt: { type: Date, default: Date.now },
});

async function createTestUsers() {
  try {
    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Test users data
    const testUsers = [
      {
        nom: "Admin",
        prenom: "Super",
        email: "admin@sn1325.cd",
        password: "admin123",
        role: "ADMIN",
      },
      {
        nom: "Utilisateur",
        prenom: "Test",
        email: "user@sn1325.cd",
        password: "user123",
        role: "USER",
      },
    ];

    console.log("\n📝 Creating test users...\n");

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(`✅ Created user: ${user.email} (${user.role})`);
      console.log(`   Temporary password: ${userData.password}`);
      console.log("");
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    console.log("\n🎉 Test users creation completed!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createTestUsers();
