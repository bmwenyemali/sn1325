"use client";

import { useState } from "react";
import { Search, X, ListChecks, Eye } from "lucide-react";
import { useDataQualitative } from "@/hooks/useApi";

export default function DataQualitativeTab() {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedData, setSelectedData] = useState<any>(null);

  const { data: qualitativeData, loading } = useDataQualitative();

  // Filter data
  const filteredData = (qualitativeData || []).filter(
    (item) =>
      item.indicateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indicateur.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bleu-rdc"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par indicateur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {qualitativeData?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Indicateurs Qualitatifs
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredData.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Résultats Filtrés
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {qualitativeData?.reduce(
              (sum, item) => sum + (item.items?.length || 0),
              0
            ) || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total LMMA
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredData.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-bleu-rdc/10 dark:bg-jaune-rdc/10 p-2 rounded-lg">
                    <ListChecks className="w-6 h-6 text-bleu-rdc dark:text-jaune-rdc" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.indicateur.nom}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Code: {item.indicateur.code}
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {item.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedData(item)}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-4"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* LMMA Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Lois, Mesures, Mécanismes et Actions (
                  {item.items?.length || 0})
                </h4>
              </div>

              {item.items && item.items.length > 0 ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {item.items.slice(0, 3).map((lmma: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 border-l-4 border-bleu-rdc dark:border-jaune-rdc"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {lmma.loisMesuresActions?.titre || "LMMA"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Année: {lmma.annee}
                            </span>
                            {lmma.loisMesuresActions?.type && (
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                                {lmma.loisMesuresActions.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {item.items.length > 3 && (
                    <button
                      onClick={() => setSelectedData(item)}
                      className="text-sm text-bleu-rdc dark:text-jaune-rdc hover:underline"
                    >
                      Voir les {item.items.length - 3} autres...
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Aucune LMMA associée
                </p>
              )}
            </div>

            {item.source && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Source:</span> {item.source}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-lg">
          <ListChecks className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune donnée qualitative trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Les données qualitatives (LMMA) apparaîtront ici
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedData.indicateur.nom}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Code: {selectedData.indicateur.code}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedData(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedData.description && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedData.description}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Lois, Mesures, Mécanismes et Actions (
                  {selectedData.items?.length || 0})
                </h3>

                {selectedData.items && selectedData.items.length > 0 ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {selectedData.items.map((lmma: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border-l-4 border-bleu-rdc dark:border-jaune-rdc"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {lmma.loisMesuresActions?.titre || "LMMA"}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                                Année: {lmma.annee}
                              </span>
                              {lmma.loisMesuresActions?.type && (
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs rounded-full">
                                  {lmma.loisMesuresActions.type}
                                </span>
                              )}
                              {lmma.ordre && (
                                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-full">
                                  Ordre: {lmma.ordre}
                                </span>
                              )}
                            </div>
                            {lmma.notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                {lmma.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Aucune LMMA associée à cet indicateur
                  </p>
                )}
              </div>

              {selectedData.source && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Source:</span>{" "}
                    {selectedData.source}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedData(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
