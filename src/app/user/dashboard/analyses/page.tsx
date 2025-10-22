"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  Calendar,
  Users,
  MapPin,
  Download,
  BarChart3,
  Activity,
} from "lucide-react";
import { useIndicateurs, useDataNumeric, useAxes } from "@/hooks/useApi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface NumericDataItem {
  _id: string;
  indicateur: { _id: string; nom: string; code: string };
  annee: number;
  valeur: number;
  sexe?: string;
  province?: { _id: string; nom: string };
  cible?: { _id: string; nom: string };
}

interface Indicateur {
  _id: string;
  nom: string;
  code: string;
  type: string;
  axe: { _id: string; nom: string; numero: number };
  desagregableParSexe?: boolean;
  desagregableParProvince?: boolean;
}

export default function AnalysesPage() {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("");

  const { data: indicateursData } = useIndicateurs();
  const { data: numericData } = useDataNumeric();
  const { data: axesData } = useAxes();

  const indicateurs = (indicateursData as Indicateur[]) || [];
  const axes = axesData || [];

  // Filter to show only quantitative indicators
  const quantitativeIndicators = indicateurs.filter(
    (ind) => ind.type === "quantitatif"
  );

  // Get selected indicator data
  const selectedIndicator = useMemo(
    () => indicateurs.find((ind) => ind._id === selectedIndicatorId),
    [indicateurs, selectedIndicatorId]
  );

  // Filter data for selected indicator
  const indicatorData = useMemo(() => {
    if (!selectedIndicatorId || !numericData) return [];
    return (numericData as NumericDataItem[]).filter(
      (item) => item.indicateur._id === selectedIndicatorId
    );
  }, [selectedIndicatorId, numericData]);

  // Analysis: Temporal evolution (by year)
  const temporalData = useMemo(() => {
    if (!indicatorData.length) return [];

    const yearGroups: Record<
      number,
      { annee: number; total: number; hommes: number; femmes: number }
    > = {};

    indicatorData.forEach((item) => {
      if (!yearGroups[item.annee]) {
        yearGroups[item.annee] = {
          annee: item.annee,
          total: 0,
          hommes: 0,
          femmes: 0,
        };
      }
      if (item.sexe === "Homme") {
        yearGroups[item.annee].hommes += item.valeur;
      } else if (item.sexe === "Femme") {
        yearGroups[item.annee].femmes += item.valeur;
      } else {
        yearGroups[item.annee].total += item.valeur;
      }
    });

    return Object.values(yearGroups).sort((a, b) => a.annee - b.annee);
  }, [indicatorData]);

  // Analysis: By gender
  const genderData = useMemo(() => {
    if (!indicatorData.length) return [];

    const genderGroups: Record<string, number> = {};
    indicatorData.forEach((item) => {
      const gender = item.sexe || "Total";
      genderGroups[gender] = (genderGroups[gender] || 0) + item.valeur;
    });

    return Object.entries(genderGroups).map(([name, value]) => ({
      name,
      value,
    }));
  }, [indicatorData]);

  // Analysis: By province
  const provinceData = useMemo(() => {
    if (!indicatorData.length) return [];

    const provinceGroups: Record<
      string,
      { total: number; hommes: number; femmes: number }
    > = {};
    indicatorData.forEach((item) => {
      if (!item.province) return;
      const provinceName = item.province.nom;
      if (!provinceGroups[provinceName]) {
        provinceGroups[provinceName] = { total: 0, hommes: 0, femmes: 0 };
      }
      if (item.sexe === "Homme") {
        provinceGroups[provinceName].hommes += item.valeur;
      } else if (item.sexe === "Femme") {
        provinceGroups[provinceName].femmes += item.valeur;
      } else {
        provinceGroups[provinceName].total += item.valeur;
      }
    });

    return Object.entries(provinceGroups)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.femmes - a.femmes); // Sort by women's impact
  }, [indicatorData]);

  // Women's impact analysis
  const womenImpactStats = useMemo(() => {
    if (!indicatorData.length) return null;

    const totalFemmes = indicatorData
      .filter((item) => item.sexe === "Femme")
      .reduce((sum, item) => sum + item.valeur, 0);

    const totalHommes = indicatorData
      .filter((item) => item.sexe === "Homme")
      .reduce((sum, item) => sum + item.valeur, 0);

    const total = totalFemmes + totalHommes;
    const pourcentageFemmes = total > 0 ? (totalFemmes / total) * 100 : 0;

    // Evolution over years
    const evolutionFemmes = temporalData.map((year) => ({
      annee: year.annee,
      pourcentage:
        year.hommes + year.femmes > 0
          ? (year.femmes / (year.hommes + year.femmes)) * 100
          : 0,
    }));

    return {
      totalFemmes,
      totalHommes,
      total,
      pourcentageFemmes,
      evolutionFemmes,
    };
  }, [indicatorData, temporalData]);

  // Export to CSV
  const exportToCSV = () => {
    if (!selectedIndicator || !indicatorData.length) return;

    const headers = ["Année", "Valeur", "Sexe", "Province", "Cible"];

    const rows = indicatorData.map((item) => [
      item.annee.toString(),
      item.valeur.toString(),
      item.sexe || "Total",
      item.province?.nom || "National",
      item.cible?.nom || "N/A",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analyse-${selectedIndicator.code}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analyses Détaillées par Indicateur
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sélectionnez un indicateur pour voir les analyses détaillées par
          année, sexe et province avec un focus sur l&apos;impact femmes
          (SN1325)
        </p>
      </div>

      {/* Indicator Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <BarChart3 className="w-5 h-5 inline mr-2" />
          Sélectionner un Indicateur Quantitatif
        </label>
        <select
          value={selectedIndicatorId}
          onChange={(e) => setSelectedIndicatorId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bleu-rdc"
        >
          <option value="">-- Choisir un indicateur --</option>
          {axes
            .sort((a, b) => a.numero - b.numero)
            .map((axe) => {
              const axeIndicators = quantitativeIndicators.filter(
                (ind) => ind.axe._id === axe._id
              );
              if (axeIndicators.length === 0) return null;
              return (
                <optgroup key={axe._id} label={`Axe ${axe.numero}: ${axe.nom}`}>
                  {axeIndicators.map((ind) => (
                    <option key={ind._id} value={ind._id}>
                      {ind.code} - {ind.nom}
                    </option>
                  ))}
                </optgroup>
              );
            })}
        </select>
      </div>

      {/* Show analysis when indicator is selected */}
      {selectedIndicator && indicatorData.length > 0 ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Données
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {indicatorData.length}
                  </p>
                </div>
                <Activity className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            {womenImpactStats && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Femmes
                      </p>
                      <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mt-1">
                        {womenImpactStats.totalFemmes.toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-10 h-10 text-pink-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        % Femmes
                      </p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                        {womenImpactStats.pourcentageFemmes.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Hommes
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {womenImpactStats.totalHommes.toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-10 h-10 text-blue-500" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              Exporter en CSV
            </button>
          </div>

          {/* Temporal Evolution Chart */}
          {temporalData.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Évolution Temporelle
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temporalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="annee" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {temporalData[0].total > 0 && (
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      name="Total"
                      strokeWidth={2}
                    />
                  )}
                  {temporalData[0].femmes > 0 && (
                    <Line
                      type="monotone"
                      dataKey="femmes"
                      stroke="#EC4899"
                      name="Femmes"
                      strokeWidth={2}
                    />
                  )}
                  {temporalData[0].hommes > 0 && (
                    <Line
                      type="monotone"
                      dataKey="hommes"
                      stroke="#3B82F6"
                      name="Hommes"
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Gender Distribution */}
          {genderData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Répartition par Sexe
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Femme"
                              ? "#EC4899"
                              : entry.name === "Homme"
                              ? "#3B82F6"
                              : "#10B981"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Women's Impact Evolution */}
              {womenImpactStats &&
                womenImpactStats.evolutionFemmes.length > 1 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-pink-500" />
                      Évolution % Femmes (SN1325)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={womenImpactStats.evolutionFemmes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="annee" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                        />
                        <Area
                          type="monotone"
                          dataKey="pourcentage"
                          stroke="#EC4899"
                          fill="#EC4899"
                          fillOpacity={0.6}
                          name="% Femmes"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
            </div>
          )}

          {/* Provincial Comparison */}
          {provinceData.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Comparaison Provinciale (Focus Femmes)
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={provinceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  {provinceData[0].femmes > 0 && (
                    <Bar dataKey="femmes" fill="#EC4899" name="Femmes" />
                  )}
                  {provinceData[0].hommes > 0 && (
                    <Bar dataKey="hommes" fill="#3B82F6" name="Hommes" />
                  )}
                  {provinceData[0].total > 0 && (
                    <Bar dataKey="total" fill="#10B981" name="Total" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Données Détaillées
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Année
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Valeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Sexe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Province
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Cible
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {indicatorData.slice(0, 20).map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.annee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        {item.valeur.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.sexe === "Femme"
                              ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
                              : item.sexe === "Homme"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {item.sexe || "Total"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.province?.nom || "National"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.cible?.nom || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {indicatorData.length > 20 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Affichage de 20 sur {indicatorData.length} entrées. Exportez
                  en CSV pour voir toutes les données.
                </p>
              )}
            </div>
          </div>
        </>
      ) : selectedIndicator && indicatorData.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune Donnée Disponible
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Aucune donnée n&apos;a été enregistrée pour cet indicateur.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sélectionnez un Indicateur
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choisissez un indicateur dans le menu déroulant ci-dessus pour voir
            les analyses détaillées.
          </p>
        </div>
      )}
    </div>
  );
}
