"use client";

import { useState, useMemo } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useDataNumeric, useAnnees, useProvinces } from "@/hooks/useApi";

const ITEMS_PER_PAGE = 50;

export default function UserDataNumericProvincialTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [sexeFilter, setSexeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data with province (provincial data)
  const { data: allData, loading } = useDataNumeric();
  const { data: annees } = useAnnees();
  const { data: provinces } = useProvinces();

  // Filter for provincial data only (province is not null)
  const provincialData = (allData || []).filter((item) => item.province);

  // Apply filters with useMemo for better performance
  const filteredData = useMemo(() => {
    return provincialData.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.indicateur?.nom
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.indicateur?.code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear =
        yearFilter === "all" || item.annee.toString() === yearFilter;
      const matchesProvince =
        provinceFilter === "all" || item.province?._id === provinceFilter;
      const matchesSexe = sexeFilter === "all" || item.sexe === sexeFilter;
      return matchesSearch && matchesYear && matchesProvince && matchesSexe;
    });
  }, [provincialData, searchTerm, yearFilter, provinceFilter, sexeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const exportToCSV = () => {
    const headers = [
      "Année",
      "Province",
      "Indicateur",
      "Code",
      "Sexe",
      "Cible",
      "Valeur",
      "Pourcentage",
      "Source",
    ];
    const rows = filteredData.map((item) => [
      item.annee,
      item.province?.nom || "N/A",
      item.indicateur.nom,
      item.indicateur.code,
      item.sexe || "Total",
      item.cible?.nom || "N/A",
      item.valeur,
      item.pourcentage || "N/A",
      item.source || "N/A",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donnees-provinciales-${
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
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un indicateur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
        </div>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        >
          <option value="all">Toutes les années</option>
          {annees?.map((a) => (
            <option key={a._id} value={a.annee}>
              {a.annee}
            </option>
          ))}
        </select>

        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        >
          <option value="all">Toutes les provinces</option>
          {provinces?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nom}
            </option>
          ))}
        </select>

        <select
          value={sexeFilter}
          onChange={(e) => setSexeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        >
          <option value="all">Tous les sexes</option>
          <option value="Total">Total</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
        </select>

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
            {provincialData.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Données Provinciales
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
            {provinces?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Provinces
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Année
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Province
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Indicateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sexe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cible
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valeur
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
              {paginatedData.map((item, idx) => (
                <tr
                  key={item._id}
                  className={
                    idx % 2 === 0
                      ? "bg-white dark:bg-slate-800"
                      : "bg-gray-50 dark:bg-slate-700/50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.annee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.province?.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="font-medium">{item.indicateur.nom}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {item.indicateur.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.sexe || "Total"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.cible?.nom || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    {item.valeur.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {item.pourcentage ? `${item.pourcentage}%` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucune donnée trouvée
          </div>
        )}

        {/* Pagination */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Affichage {(currentPage - 1) * ITEMS_PER_PAGE + 1} à{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} sur{" "}
              {filteredData.length} résultats
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-1 text-sm">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
