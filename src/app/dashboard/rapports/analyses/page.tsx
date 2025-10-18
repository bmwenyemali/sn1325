"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
} from "lucide-react";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export default function AnalysesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025");

  // Mock data for charts
  const axesData: ChartData[] = [
    { label: "Participation", value: 75, color: "#002B7F" },
    { label: "Protection", value: 68, color: "#FCD116" },
    { label: "Prévention", value: 82, color: "#CE1126" },
    { label: "Relèvement", value: 59, color: "#4CAF50" },
    { label: "Coordination", value: 71, color: "#9C27B0" },
  ];

  const provinceData: ChartData[] = [
    { label: "Kinshasa", value: 245, color: "#002B7F" },
    { label: "Nord-Kivu", value: 189, color: "#FCD116" },
    { label: "Sud-Kivu", value: 156, color: "#CE1126" },
    { label: "Haut-Katanga", value: 134, color: "#4CAF50" },
    { label: "Autres", value: 456, color: "#9C27B0" },
  ];

  const evolutionData = [
    { annee: "2020", valeur: 45 },
    { annee: "2021", valeur: 52 },
    { annee: "2022", valeur: 61 },
    { annee: "2023", valeur: 68 },
    { annee: "2024", valeur: 73 },
    { annee: "2025", valeur: 78 },
  ];

  const handleExportReport = () => {
    // Génération de rapport PDF (mock)
    alert("Export du rapport en cours...");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analyses et Rapports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualisez les statistiques et tendances des données SN1325
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 bg-bleu-rdc hover:bg-bleu-rdc-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Exporter PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bleu-rdc dark:focus:ring-blue-500"
          >
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Période: {selectedPeriod}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">
              Indicateurs suivis
            </span>
            <BarChart3 className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">245</p>
          <p className="text-sm opacity-75 mt-1">+12% vs année précédente</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">
              Données validées
            </span>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">1,832</p>
          <p className="text-sm opacity-75 mt-1">+18% ce trimestre</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">
              Provinces actives
            </span>
            <BarChart3 className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">26</p>
          <p className="text-sm opacity-75 mt-1">Couverture nationale</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">
              Progression globale
            </span>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">73%</p>
          <p className="text-sm opacity-75 mt-1">+5% ce mois</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Axes Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Progrès par Axe Stratégique
          </h3>
          <div className="space-y-4">
            {axesData.map((axe) => (
              <div key={axe.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {axe.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {axe.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${axe.value}%`,
                      backgroundColor: axe.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Provincial Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition par Province (Top 5)
          </h3>
          <div className="space-y-3">
            {provinceData.map((province) => (
              <div key={province.label} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {province.label}
                </div>
                <div className="flex-1 ml-4">
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-8 relative">
                    <div
                      className="h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{
                        width: `${(province.value / 500) * 100}%`,
                        backgroundColor: province.color,
                      }}
                    >
                      <span className="text-sm font-semibold text-white">
                        {province.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Évolution de la Progression Globale
        </h3>
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-around">
            {evolutionData.map((item) => (
              <div
                key={item.annee}
                className="flex flex-col items-center flex-1 mx-2"
              >
                <div className="w-full">
                  <div
                    className="bg-gradient-to-t from-bleu-rdc to-blue-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${(item.valeur / 100) * 200}px` }}
                  >
                    <div className="flex items-start justify-center pt-2">
                      <span className="text-xs font-semibold text-white">
                        {item.valeur}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.annee}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Statistiques Récapitulatives
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Validées
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  En attente
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Taux
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Participation
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  524
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  487
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  37
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                  93%
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Protection
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  412
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  365
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  47
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                  89%
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Prévention
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  389
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  351
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  38
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                  90%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
