"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminImportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    details?: string;
  } | null>(null);

  // Vérifier si l'utilisateur est connecté
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Non Connecté
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Veuillez vous connecter pour accéder à cette page.
          </p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="btn-primary w-full"
          >
            Se Connecter
          </button>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est admin
  const userRole = session.user?.role;

  if (userRole !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Accès Refusé
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Cette page est réservée aux administrateurs.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Votre rôle actuel: {userRole || "Non défini"}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary w-full"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleImport = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/import-old-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Import réussi!",
        });
      } else {
        setResult({
          success: false,
          error: data.error || "Erreur lors de l'import",
          details: data.details,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: "Erreur de connexion au serveur",
        details: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-bleu-rdc dark:bg-jaune-rdc rounded-lg flex items-center justify-center">
              <Database className="w-8 h-8 text-white dark:text-bleu-rdc" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Import des Données OldData
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Importer toutes les données depuis le dossier OldData vers
                MongoDB
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              ⚠️ Attention
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>
                • Cette opération va importer toutes les données du dossier
                OldData
              </li>
              <li>
                • Cela inclut: axes, indicateurs, provinces, données numériques,
                données qualitatives, etc.
              </li>
              <li>
                • L&apos;import peut prendre plusieurs minutes selon la quantité
                de données
              </li>
              <li>
                • L&apos;utilisateur <strong>ben@gmail.com</strong> sera créé
                automatiquement
              </li>
              <li>• Les doublons seront automatiquement ignorés</li>
            </ul>
          </div>
        </div>

        {/* Import Button */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-6">
          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Import en cours...</span>
              </>
            ) : (
              <>
                <Database className="w-6 h-6" />
                <span>Lancer l&apos;Import</span>
              </>
            )}
          </button>

          {loading && (
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="animate-pulse">
                Veuillez patienter, l&apos;import des données est en cours...
              </p>
              <p className="mt-2">
                Cette opération peut prendre plusieurs minutes.
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div
            className={`p-6 rounded-xl shadow-lg ${
              result.success
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-start space-x-4">
              {result.success ? (
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    result.success
                      ? "text-green-900 dark:text-green-300"
                      : "text-red-900 dark:text-red-300"
                  }`}
                >
                  {result.success ? "✅ Import Réussi!" : "❌ Erreur d'Import"}
                </h3>
                <p
                  className={`${
                    result.success
                      ? "text-green-800 dark:text-green-400"
                      : "text-red-800 dark:text-red-400"
                  }`}
                >
                  {result.message || result.error}
                </p>
                {result.details && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-400 font-mono bg-white/50 dark:bg-slate-900/50 p-3 rounded">
                    {result.details}
                  </p>
                )}
                {result.success && (
                  <div className="mt-4 space-y-2">
                    <p className="text-green-800 dark:text-green-400 font-semibold">
                      Prochaines étapes:
                    </p>
                    <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                      <li>
                        ✓ Toutes les données ont été importées dans MongoDB
                      </li>
                      <li>
                        ✓ Utilisateur test créé: <strong>ben@gmail.com</strong>{" "}
                        (mot de passe: 12345)
                      </li>
                      <li>
                        ✓ Vous pouvez maintenant consulter les données dans le
                        dashboard
                      </li>
                    </ul>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="mt-4 btn-primary"
                    >
                      Aller au Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            📊 Données qui seront importées:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Référentiels:</strong>
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1 pl-4">
                <li>• 6 Axes stratégiques</li>
                <li>• 11 Grandes Catégories</li>
                <li>• 19 Catégories</li>
                <li>• Cibles</li>
                <li>• 26 Provinces</li>
                <li>• Années</li>
                <li>• Structures/Organisations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Données:</strong>
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1 pl-4">
                <li>• ~40 Indicateurs (numériques + qualitatifs)</li>
                <li>• Lois/Mesures/Mécanismes/Actions</li>
                <li>• Données numériques désagrégées</li>
                <li>• Données qualitatives (listes)</li>
                <li>• Données par province</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
