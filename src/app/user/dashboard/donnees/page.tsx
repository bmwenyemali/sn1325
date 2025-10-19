"use client";

import { useState } from "react";
import { Database, Filter, Search } from "lucide-react";
import { useAxes, useIndicateurs } from "@/hooks/useApi";

interface Axe {
  _id: string;
  nom: string;
  numero: number;
}

interface Indicateur {
  _id: string;
  nom: string;
  axe: Axe;
  type: string;
}

export default function UserDonneesPage() {
  const { data: axesData, loading: axesLoading } = useAxes();
  const { data: indicateursData, loading: indicateursLoading } =
    useIndicateurs();
  const [axeFilter, setAxeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const axes: Axe[] = axesData || [];
  const indicateurs: Indicateur[] = indicateursData || [];
  const loading = axesLoading || indicateursLoading;

  const filteredIndicateurs = indicateurs.filter((ind) => {
    const matchesSearch = ind.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAxe = axeFilter === "all" || ind.axe?._id === axeFilter;
    return matchesSearch && matchesAxe;
  });

  // Group by axe
  const groupedByAxe = axes
    .map((axe) => ({
      axe,
      indicateurs: filteredIndicateurs.filter(
        (ind) => ind.axe?._id === axe._id
      ),
    }))
    .filter((group) => group.indicateurs.length > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bleu-rdc"></div>
      </div>
    );
  }

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
                <option key={axe._id} value={axe._id}>
                  Axe {axe.numero}: {axe.nom}
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

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {axes.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Axes Stratégiques
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {indicateurs.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Indicateurs Totaux
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {filteredIndicateurs.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Résultats Filtrés
          </div>
        </div>
      </div>

      {/* Indicateurs by Axe */}
      {groupedByAxe.length > 0 ? (
        <div className="space-y-6">
          {groupedByAxe.map(({ axe, indicateurs }) => (
            <div
              key={axe._id}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Axe {axe.numero}: {axe.nom}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicateurs.map((ind) => (
                  <div
                    key={ind._id}
                    className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:border-bleu-rdc dark:hover:border-jaune-rdc transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                        {ind.nom}
                      </h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                        {ind.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg text-center">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune donnée trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}
    </div>
  );
}
