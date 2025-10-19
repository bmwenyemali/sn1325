import mongoose from "mongoose";

// ⚠️ IMPORTANT: Always use environment variables for database credentials
// Never hardcode credentials in your code!
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI environment variable is not set");
  console.log("Please set MONGODB_URI in your .env.local file");
  process.exit(1);
}

async function checkUsers() {
  try {
    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get User model
    const UserSchema = new mongoose.Schema(
      {},
      { strict: false, collection: "users" }
    );
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Find all users
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nom} ${user.prenom || ""}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role || "N/A"}`);
      console.log(`   ID: ${user._id}`);
      console.log("");
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkUsers();
