"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  Download,
  Search,
  Calendar,
  MapPin,
  BarChart3,
} from "lucide-react";

interface Province {
  _id: string;
  nom: string;
}

interface Annee {
  _id: string;
  annee: number;
}

interface Indicateur {
  _id: string;
  nom: string;
  axe: { nom: string };
}

interface DataRow {
  _id: string;
  indicateur: { nom: string; axe: { nom: string } };
  annee: number;
  province?: { nom: string };
  sexe?: string;
  valeur: number;
  pourcentage?: number;
}

export default function ConsultationPage() {
  const [data, setData] = useState<DataRow[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [annees, setAnnees] = useState<Annee[]>([]);
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [filters, setFilters] = useState({
    search: "",
    province: "",
    annee: "",
    indicateur: "",
    sexe: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      // Fetch référentiels (mock data for now)
      setProvinces([
        { _id: "1", nom: "Kinshasa" },
        { _id: "2", nom: "Nord-Kivu" },
        { _id: "3", nom: "Sud-Kivu" },
      ]);
      setAnnees([
        { _id: "1", annee: 2023 },
        { _id: "2", annee: 2024 },
        { _id: "3", annee: 2025 },
      ]);
      setIndicateurs([
        { _id: "1", nom: "Femmes au Parlement", axe: { nom: "Participation" } },
        { _id: "2", nom: "Violences signalées", axe: { nom: "Protection" } },
      ]);
    } catch (error) {
      console.error("Erreur chargement référentiels:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data - remplacer par appel API réel
      const mockData: DataRow[] = [
        {
          _id: "1",
          indicateur: {
            nom: "Femmes au Parlement",
            axe: { nom: "Participation" },
          },
          annee: 2025,
          province: { nom: "Kinshasa" },
          sexe: "Femme",
          valeur: 145,
          pourcentage: 22.5,
        },
        {
          _id: "2",
          indicateur: {
            nom: "Violences signalées",
            axe: { nom: "Protection" },
          },
          annee: 2025,
          province: { nom: "Nord-Kivu" },
          sexe: "Total",
          valeur: 892,
        },
      ];
      setData(mockData);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export CSV logic
    const csv = [
      ["Indicateur", "Axe", "Année", "Province", "Sexe", "Valeur", "%"],
      ...data.map((row) => [
        row.indicateur.nom,
        row.indicateur.axe.nom,
        row.annee,
        row.province?.nom || "National",
        row.sexe || "Total",
        row.valeur,
        row.pourcentage || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donnees-sn1325-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Consultation des Données
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualisez et exportez les données des indicateurs SN1325
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtres
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-bleu-rdc dark:focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Province
            </label>
            <select
              value={filters.province}
              onChange={(e) =>
                setFilters({ ...filters, province: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bleu-rdc dark:focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les provinces</option>
              {provinces.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Année */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Année
            </label>
            <select
              value={filters.annee}
              onChange={(e) =>
                setFilters({ ...filters, annee: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bleu-rdc dark:focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les années</option>
              {annees.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.annee}
                </option>
              ))}
            </select>
          </div>

          {/* Indicateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Indicateur
            </label>
            <select
              value={filters.indicateur}
              onChange={(e) =>
                setFilters({ ...filters, indicateur: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bleu-rdc dark:focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les indicateurs</option>
              {indicateurs.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Sexe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sexe
            </label>
            <select
              value={filters.sexe}
              onChange={(e) => setFilters({ ...filters, sexe: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bleu-rdc dark:focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Total">Total</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() =>
              setFilters({
                search: "",
                province: "",
                annee: "",
                indicateur: "",
                sexe: "",
              })
            }
            className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleExport}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-sm bg-bleu-rdc hover:bg-bleu-rdc-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bleu-rdc mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Chargement des données...
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucune donnée trouvée avec ces filtres
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Indicateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Axe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Année
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Province
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Sexe
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {data.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {row.indicateur.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {row.indicateur.axe.nom}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {row.annee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {row.province?.nom || "National"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {row.sexe || "Total"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-gray-100">
                      {row.valeur.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                      {row.pourcentage ? `${row.pourcentage}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total entrées
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {data.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Provinces</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {new Set(data.map((d) => d.province?.nom).filter(Boolean)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indicateurs
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {new Set(data.map((d) => d.indicateur.nom).filter(Boolean)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dernière MAJ
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Aujourd&apos;hui
          </p>
        </div>
      </div>
    </div>
  );
}
