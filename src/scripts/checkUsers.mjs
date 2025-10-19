import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://didier:Bienvenue2018@sn1325cluster.2d5fksa.mongodb.net/sn1325";

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

    console.log("\n📊 All users in database:");
    console.log("========================\n");

    users.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Role Type: ${typeof user.role}`);
      console.log(`Name: ${user.prenom} ${user.nom}`);
      console.log("---");
    });

    console.log(`\n✨ Total users: ${users.length}`);

    await mongoose.connection.close();
    console.log("\n✅ Connection closed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkUsers();
