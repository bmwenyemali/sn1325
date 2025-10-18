"use client";

import { useState } from "react";
import { Database, Filter, Search, Eye } from "lucide-react";

export default function UserDonneesPage() {
  const [axeFilter, setAxeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // This will be replaced with actual API calls
  const axes = [
    { id: 1, nom: "Prévention" },
    { id: 2, nom: "Participation" },
    { id: 3, nom: "Protection" },
    { id: 4, nom: "Secours et Relèvement" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Données
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez toutes les données enregistrées, classées par axes
          stratégiques
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Filtrer par axe
            </label>
            <select
              value={axeFilter}
              onChange={(e) => setAxeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les axes</option>
              {axes.map((axe) => (
                <option key={axe.id} value={axe.id}>
                  {axe.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les données..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Data Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <Database className="w-10 h-10 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Données Numériques
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Données quantitatives et statistiques
          </p>
          <button className="flex items-center text-bleu-rdc dark:text-jaune-rdc font-semibold hover:underline">
            <Eye className="w-4 h-4 mr-2" />
            Consulter
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <Database className="w-10 h-10 text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Données Liste
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Données qualitatives et descriptives
          </p>
          <button className="flex items-center text-bleu-rdc dark:text-jaune-rdc font-semibold hover:underline">
            <Eye className="w-4 h-4 mr-2" />
            Consulter
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <Database className="w-10 h-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Données Provinciales
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Données agrégées par province
          </p>
          <button className="flex items-center text-bleu-rdc dark:text-jaune-rdc font-semibold hover:underline">
            <Eye className="w-4 h-4 mr-2" />
            Consulter
          </button>
        </div>
      </div>

      {/* Placeholder for data display */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg text-center">
        <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Sélectionnez une catégorie
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choisissez une catégorie de données ci-dessus pour commencer la
          consultation
        </p>
      </div>
    </div>
  );
}
