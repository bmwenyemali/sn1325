"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Filter,
} from "lucide-react";
import { useAxes, useIndicateurs, useProvinces } from "@/hooks/useApi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

interface Indicateur {
  _id: string;
  nom: string;
  type: string;
  axe: { _id: string; nom: string; numero: number };
  desagregableParSexe?: boolean;
  desagregableParProvince?: boolean;
  desagregableParAnnee?: boolean;
  avecCible?: boolean;
}

export default function UserStatistiquesPage() {
  const { data: axesData } = useAxes();
  const { data: indicateursData } = useIndicateurs();
  const { data: provincesData } = useProvinces();
  const [selectedChart, setSelectedChart] = useState<"bar" | "pie" | "line">(
    "bar"
  );

  const axes = axesData || [];
  const indicateurs: Indicateur[] = (indicateursData as Indicateur[]) || [];
  const provinces = provincesData || [];

  // Préparer les données pour les graphiques
  const indicateursParAxe = axes.map((axe) => ({
    name: `Axe ${axe.numero}`,
    indicateurs: indicateurs.filter((ind) => ind.axe?._id === axe._id).length,
    axeComplet: axe.nom,
  }));

  const indicateursParType = [
    {
      name: "Numérique",
      value: indicateurs.filter((ind) => ind.type === "Numerique").length,
    },
    {
      name: "Province",
      value: indicateurs.filter((ind) => ind.type === "Province").length,
    },
    {
      name: "Liste",
      value: indicateurs.filter((ind) => ind.type === "Liste").length,
    },
  ].filter((item) => item.value > 0);

  // Données simulées pour la tendance temporelle
  const tendanceData = [
    { mois: "Jan", donnees: 45, cible: 50 },
    { mois: "Fev", donnees: 52, cible: 50 },
    { mois: "Mar", donnees: 61, cible: 60 },
    { mois: "Avr", donnees: 58, cible: 60 },
    { mois: "Mai", donnees: 69, cible: 70 },
    { mois: "Juin", donnees: 75, cible: 70 },
  ];

  // Statistiques des indicateurs désagrégés
  const desagregationStats = [
    {
      name: "Par Sexe",
      value: indicateurs.filter((ind) => ind.desagregableParSexe).length,
    },
    {
      name: "Par Province",
      value: indicateurs.filter((ind) => ind.desagregableParProvince).length,
    },
    {
      name: "Par Année",
      value: indicateurs.filter((ind) => ind.desagregableParAnnee).length,
    },
    {
      name: "Avec Cible",
      value: indicateurs.filter((ind) => ind.avecCible).length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Statistiques et Analyses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualisations graphiques et analyses statistiques des données
        </p>
      </div>

      {/* Chart Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedChart("bar")}
          className={`p-6 rounded-xl shadow-lg transition-all ${
            selectedChart === "bar"
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:shadow-xl"
          }`}
        >
          <BarChart3 className="w-10 h-10 mb-4 mx-auto" />
          <h3 className="text-xl font-bold mb-2">Graphiques en Barres</h3>
          <p
            className={`text-sm ${
              selectedChart === "bar"
                ? "text-blue-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Comparaisons et évolutions
          </p>
        </button>

        <button
          onClick={() => setSelectedChart("pie")}
          className={`p-6 rounded-xl shadow-lg transition-all ${
            selectedChart === "pie"
              ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
              : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:shadow-xl"
          }`}
        >
          <PieChartIcon className="w-10 h-10 mb-4 mx-auto" />
          <h3 className="text-xl font-bold mb-2">Graphiques Circulaires</h3>
          <p
            className={`text-sm ${
              selectedChart === "pie"
                ? "text-green-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Répartitions et proportions
          </p>
        </button>

        <button
          onClick={() => setSelectedChart("line")}
          className={`p-6 rounded-xl shadow-lg transition-all ${
            selectedChart === "line"
              ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
              : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:shadow-xl"
          }`}
        >
          <LineChartIcon className="w-10 h-10 mb-4 mx-auto" />
          <h3 className="text-xl font-bold mb-2">Graphiques Linéaires</h3>
          <p
            className={`text-sm ${
              selectedChart === "line"
                ? "text-purple-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Tendances temporelles
          </p>
        </button>
      </div>

      {/* Main Chart Display */}
      {selectedChart === "bar" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Nombre d&apos;Indicateurs par Axe Stratégique
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={indicateursParAxe}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {payload[0].payload.axeComplet}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400">
                          Indicateurs: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar
                dataKey="indicateurs"
                fill="#3B82F6"
                name="Nombre d'indicateurs"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedChart === "pie" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Répartition des Indicateurs par Type
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={indicateursParType}
                cx="50%"
                cy="50%"
                label
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {indicateursParType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedChart === "line" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Évolution de la Collecte de Données (2025)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={tendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="donnees"
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Données collectées"
                dot={{ fill: "#8B5CF6", r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="cible"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Cible"
                dot={{ fill: "#10B981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Désagrégation Statistics */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Filter className="w-6 h-6 mr-3 text-bleu-rdc dark:text-jaune-rdc" />
          Capacités de Désagrégation des Indicateurs
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={desagregationStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#F59E0B" name="Nombre d'indicateurs" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Total Axes
          </h3>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {axes.length}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Axes stratégiques
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Total Indicateurs
          </h3>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            {indicateurs.length}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indicateurs suivis
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Provinces
          </h3>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {provinces.length}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Couverture nationale
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Taux de Réalisation
          </h3>
          <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            87%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Objectifs 2025
          </p>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Note:</strong> Les graphiques affichent les données en temps
            réel basées sur les indicateurs et axes configurés dans le système.
            Les données de tendance sont simulées pour démonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
