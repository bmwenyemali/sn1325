"use client";

import { useState } from "react";
import { Search, Download, ListChecks, X } from "lucide-react";
import { useDataQualitative } from "@/hooks/useApi";

export default function UserDataQualitativeTab() {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedData, setSelectedData] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: qualitativeData, loading } = useDataQualitative();

  // Filter data
  const filteredData = (qualitativeData || []).filter(
    (item) =>
      item.indicateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indicateur.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["Indicateur", "Code", "LMMA", "Type", "Année", "Notes"];
    const rows: string[][] = [];

    filteredData.forEach((item) => {
      item.items?.forEach(
        (lmma: {
          loisMesuresActions: { titre: string; type: string };
          annee: number;
          notes?: string;
        }) => {
          rows.push([
            item.indicateur.nom,
            item.indicateur.code,
            lmma.loisMesuresActions.titre,
            lmma.loisMesuresActions.type,
            lmma.annee.toString(),
            lmma.notes || "N/A",
          ]);
        }
      );
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donnees-qualitatives-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

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

        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Exporter</span>
        </button>
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

              {item.items && item.items.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedData(item);
                    setIsDetailModalOpen(true);
                  }}
                  className="px-4 py-2 bg-bleu-rdc hover:bg-bleu-rdc/90 text-white rounded-lg transition-colors text-sm"
                >
                  Voir tous ({item.items.length})
                </button>
              )}
            </div>

            {/* Items Preview */}
            {item.items && item.items.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Lois, Mesures & Actions
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                  {item.items.slice(0, 3).map(
                    (
                      lmma: {
                        loisMesuresActions: { titre: string; type: string };
                        annee: number;
                        ordre?: number;
                      },
                      idx: number
                    ) => (
                      <li key={idx} className="pl-2">
                        <span className="font-medium">
                          {lmma.ordre ? `${lmma.ordre}. ` : ""}
                          {lmma.loisMesuresActions.titre}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({lmma.loisMesuresActions.type}, {lmma.annee})
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {(!item.items || item.items.length === 0) && (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Aucun item LMMA
              </div>
            )}
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucune donnée qualitative trouvée
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Détails - {selectedData.indicateur.nom}
              </h2>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedData(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  CODE
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedData.indicateur.code}
                </p>
              </div>

              {selectedData.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    DESCRIPTION
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedData.description}
                  </p>
                </div>
              )}

              {selectedData.source && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    SOURCE
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedData.source}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  LOIS, MESURES & ACTIONS ({selectedData.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedData.items?.map(
                    (
                      lmma: {
                        loisMesuresActions: { titre: string; type: string };
                        annee: number;
                        ordre?: number;
                        notes?: string;
                      },
                      idx: number
                    ) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {lmma.ordre ? `${lmma.ordre}. ` : ""}
                              {lmma.loisMesuresActions.titre}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span className="font-medium">
                                {lmma.loisMesuresActions.type}
                              </span>{" "}
                              - {lmma.annee}
                            </p>
                            {lmma.notes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {lmma.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  {(!selectedData.items || selectedData.items.length === 0) && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Aucun item LMMA
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
