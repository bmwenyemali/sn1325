// Script simple pour initialiser la base de données
const https = require("https");
const http = require("http");

async function initializeDatabase() {
  try {
    console.log("Initialisation de la base de données...");

    const response = await fetch("http://localhost:3000/api/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Base de données initialisée avec succès!");
      console.log("Résultat:", result);
    } else {
      console.error("❌ Erreur lors de l'initialisation:", response.statusText);
      const error = await response.text();
      console.error("Détails:", error);
    }
  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);
    console.log(
      "Assurez-vous que le serveur de développement est lancé (npm run dev)"
    );
  }
}

initializeDatabase();
