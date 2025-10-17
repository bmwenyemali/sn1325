// Simple script to run database initialization
const { exec } = require("child_process");

console.log("🚀 Starting database initialization...\n");

// Try to connect to the running dev server
fetch("http://localhost:3004/api/init", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((data) => {
    if (data.ok) {
      console.log("✅ Database initialized successfully!");
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error("❌ Initialization failed:", data.error);
    }
  })
  .catch((error) => {
    console.error("❌ Could not connect to server:", error.message);
    console.log("\n💡 Make sure the dev server is running:");
    console.log("   npm run dev");
  });
