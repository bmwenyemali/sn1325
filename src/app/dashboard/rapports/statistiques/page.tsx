"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Download, Filter, Calendar, MapPin, TrendingUp } from "lucide-react";

interface StatsData {
  axe: string;
  valeur: number;
  couleur: string;
  [key: string]: string | number; // Index signature for chart compatibility
}

interface ProvinceData {
  province: string;
  participation: number;
  protection: number;
  prevention: number;
  relevement: number;
  coordination: number;
}

interface EvolutionData {
  periode: string;
  valeur: number;
}

export default function StatistiquesPage() {
  const [loading, setLoading] = useState(true);
  const [selectedAxe, setSelectedAxe] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("2025");

  const [statsData, setStatsData] = useState<StatsData[]>([]);
  const [provincesData, setProvincesData] = useState<ProvinceData[]>([]);
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);

  const axes = [
    { id: "1", nom: "Participation", couleur: "#002B7F" },
    { id: "2", nom: "Protection", couleur: "#FCD116" },
    { id: "3", nom: "Prévention", couleur: "#CE1126" },
    { id: "4", nom: "Relèvement", couleur: "#28A745" },
    { id: "5", nom: "Coordination", couleur: "#6F42C1" },
  ];

  const provinces = [
    "Kinshasa",
    "Nord-Kivu",
    "Sud-Kivu",
    "Haut-Katanga",
    "Kongo-Central",
    "Kasaï",
    "Kasaï-Oriental",
  ];

  useEffect(() => {
    fetchStatistics();
  }, [selectedAxe, selectedProvince, selectedPeriode]);

  const fetchStatistics = async () => {
    try {
      // Simulated data - replace with actual API calls
      const mockStatsData: StatsData[] = [
        { axe: "Participation", valeur: 75, couleur: "#002B7F" },
        { axe: "Protection", valeur: 68, couleur: "#FCD116" },
        { axe: "Prévention", valeur: 82, couleur: "#CE1126" },
        { axe: "Relèvement", valeur: 59, couleur: "#28A745" },
        { axe: "Coordination", valeur: 71, couleur: "#6F42C1" },
      ];

      const mockProvincesData: ProvinceData[] = [
        {
          province: "Kinshasa",
          participation: 85,
          protection: 72,
          prevention: 78,
          relevement: 65,
          coordination: 80,
        },
        {
          province: "Nord-Kivu",
          participation: 65,
          protection: 58,
          prevention: 85,
          relevement: 52,
          coordination: 68,
        },
        {
          province: "Sud-Kivu",
          participation: 70,
          protection: 63,
          prevention: 80,
          relevement: 55,
          coordination: 72,
        },
        {
          province: "Haut-Katanga",
          participation: 78,
          protection: 75,
          prevention: 82,
          relevement: 70,
          coordination: 76,
        },
      ];

      const mockEvolutionData: EvolutionData[] = [
        { periode: "T1 2024", valeur: 65 },
        { periode: "T2 2024", valeur: 68 },
        { periode: "T3 2024", valeur: 71 },
        { periode: "T4 2024", valeur: 73 },
        { periode: "T1 2025", valeur: 75 },
        { periode: "T2 2025", valeur: 78 },
      ];

      setStatsData(mockStatsData);
      setProvincesData(mockProvincesData);
      setEvolutionData(mockEvolutionData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    // Simulate report generation
    const reportData = {
      periode: selectedPeriode,
      axe: selectedAxe || "Tous les axes",
      province: selectedProvince || "Toutes les provinces",
      dateGeneration: new Date().toLocaleDateString("fr-FR"),
    };

    console.log("Génération du rapport:", reportData);
    alert("Rapport généré avec succès ! Le téléchargement va commencer...");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Rapports Statistiques
        </h1>
        <p className="text-gray-600">
          Visualisez et exportez les données de suivi de la résolution 1325
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Période
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Axe
            </label>
            <select
              value={selectedAxe}
              onChange={(e) => setSelectedAxe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
            >
              <option value="">Tous les axes</option>
              {axes.map((axe) => (
                <option key={axe.id} value={axe.id}>
                  {axe.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              Province
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
            >
              <option value="">Toutes les provinces</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-bleu-rdc-700"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {statsData.map((stat) => (
          <div
            key={stat.axe}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.axe}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.valeur}%
                </p>
              </div>
              <div
                className="w-3 h-12 rounded"
                style={{ backgroundColor: stat.couleur }}
              />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+5% ce mois</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Progress by Axis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progrès par Axe Stratégique
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="axe"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value}%`, "Progression"]}
                labelStyle={{ color: "#374151" }}
              />
              <Bar dataKey="valeur" fill="#002B7F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition des Progrès
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="valeur"
                label={({ axe, valeur }) => `${axe}: ${valeur}%`}
              >
                {statsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Progression"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Provincial Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparaison Provinciale
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={provincesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis
                dataKey="province"
                type="category"
                width={100}
                fontSize={12}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Score"]}
                labelStyle={{ color: "#374151" }}
              />
              <Legend />
              <Bar
                dataKey="participation"
                stackId="a"
                fill="#002B7F"
                name="Participation"
              />
              <Bar
                dataKey="protection"
                stackId="a"
                fill="#FCD116"
                name="Protection"
              />
              <Bar
                dataKey="prevention"
                stackId="a"
                fill="#CE1126"
                name="Prévention"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evolution Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution Temporelle
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periode" fontSize={12} />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Progression globale"]}
                labelStyle={{ color: "#374151" }}
              />
              <Line
                type="monotone"
                dataKey="valeur"
                stroke="#002B7F"
                strokeWidth={3}
                dot={{ fill: "#002B7F", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#002B7F", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Résumé Détaillé par Province
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prévention
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relèvement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moyenne
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {provincesData.map((province) => {
                const moyenne = Math.round(
                  (province.participation +
                    province.protection +
                    province.prevention +
                    province.relevement +
                    province.coordination) /
                    5
                );

                return (
                  <tr key={province.province} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {province.province}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          province.participation >= 75
                            ? "bg-green-100 text-green-800"
                            : province.participation >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {province.participation}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          province.protection >= 75
                            ? "bg-green-100 text-green-800"
                            : province.protection >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {province.protection}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          province.prevention >= 75
                            ? "bg-green-100 text-green-800"
                            : province.prevention >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {province.prevention}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          province.relevement >= 75
                            ? "bg-green-100 text-green-800"
                            : province.relevement >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {province.relevement}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          province.coordination >= 75
                            ? "bg-green-100 text-green-800"
                            : province.coordination >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {province.coordination}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                          moyenne >= 75
                            ? "bg-green-100 text-green-800"
                            : moyenne >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {moyenne}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
