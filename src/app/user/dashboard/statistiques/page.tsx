"use client";

import { useMemo } from "react";
import {
  Users,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  useAxes,
  useIndicateurs,
  useProvinces,
  useDataNumeric,
  useDataQualitative,
} from "@/hooks/useApi";
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
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
];

interface Indicateur {
  _id: string;
  nom: string;
  type: string;
  axe: { _id: string; nom: string; numero: number };
}

export default function UserStatistiquesPage() {
  const { data: axesData } = useAxes();
  const { data: indicateursData } = useIndicateurs();
  const { data: provincesData } = useProvinces();
  const { data: numericData } = useDataNumeric();
  const { data: qualitativeData } = useDataQualitative();

  const axes = axesData || [];
  const indicateurs: Indicateur[] = (indicateursData as Indicateur[]) || [];
  const provinces = provincesData || [];

  // Real data statistics calculations
  const stats = useMemo(() => {
    const nationalData = (numericData || []).filter((item) => !item.province);
    const provincialData = (numericData || []).filter((item) => item.province);
    const lmmaData = qualitativeData || [];

    const totalLMMA = lmmaData.reduce(
      (sum, item) => sum + (item.items?.length || 0),
      0
    );

    return {
      totalNationalData: nationalData.length,
      totalProvincialData: provincialData.length,
      totalQualitativeData: lmmaData.length,
      totalLMMA,
      totalIndicators: indicateurs.length,
      totalProvinces: provinces.length - 1, // Exclude "National" province
    };
  }, [numericData, qualitativeData, indicateurs, provinces]);

  // Data by year
  const dataByYear = useMemo(() => {
    const yearCounts: Record<
      number,
      { annee: number; national: number; provincial: number; lmma: number }
    > = {};

    (numericData || []).forEach((item) => {
      if (!yearCounts[item.annee]) {
        yearCounts[item.annee] = {
          annee: item.annee,
          national: 0,
          provincial: 0,
          lmma: 0,
        };
      }
      if (item.province) {
        yearCounts[item.annee].provincial++;
      } else {
        yearCounts[item.annee].national++;
      }
    });

    (qualitativeData || []).forEach((item) => {
      item.items?.forEach((lmma: { annee: number }) => {
        if (!yearCounts[lmma.annee]) {
          yearCounts[lmma.annee] = {
            annee: lmma.annee,
            national: 0,
            provincial: 0,
            lmma: 0,
          };
        }
        yearCounts[lmma.annee].lmma++;
      });
    });

    return Object.values(yearCounts).sort((a, b) => a.annee - b.annee);
  }, [numericData, qualitativeData]);

  // Data by gender - Sum of values by gender
  const dataByGender = useMemo(() => {
    const genderSums: Record<string, number> = {
      Homme: 0,
      Femme: 0,
    };

    (numericData || []).forEach((item) => {
      if (item.sexe === "Homme") {
        genderSums.Homme += item.valeur || 0;
      } else if (item.sexe === "Femme") {
        genderSums.Femme += item.valeur || 0;
      }
    });

    const total = genderSums.Homme + genderSums.Femme;

    return [
      {
        name: "Hommes",
        valeur: genderSums.Homme,
        pourcentage:
          total > 0 ? ((genderSums.Homme / total) * 100).toFixed(1) : 0,
      },
      {
        name: "Femmes",
        valeur: genderSums.Femme,
        pourcentage:
          total > 0 ? ((genderSums.Femme / total) * 100).toFixed(1) : 0,
      },
    ];
  }, [numericData]);

  // Data by province (top 10)
  const dataByProvince = useMemo(() => {
    const provinceCounts: Record<string, number> = {};

    (numericData || [])
      .filter((item) => item.province)
      .forEach((item) => {
        const provinceName = item.province!.nom;
        provinceCounts[provinceName] = (provinceCounts[provinceName] || 0) + 1;
      });

    return Object.entries(provinceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [numericData]);

  // Data by axe - count of data entries per axe
  const dataByAxe = useMemo(() => {
    const axeCounts: Record<
      string,
      { name: string; numero: number; indicateurs: number; donnees: number }
    > = {};

    axes.forEach((axe) => {
      axeCounts[axe._id] = {
        name: `Axe ${axe.numero}: ${axe.nom}`,
        numero: axe.numero,
        indicateurs: 0,
        donnees: 0,
      };
    });

    indicateurs.forEach((ind) => {
      if (ind.axe && axeCounts[ind.axe._id]) {
        axeCounts[ind.axe._id].indicateurs++;
      }
    });

    (numericData || []).forEach((item) => {
      // Find the axe for this indicator
      const indicator = indicateurs.find(
        (ind) => ind._id === item.indicateur._id
      );
      if (indicator && indicator.axe && axeCounts[indicator.axe._id]) {
        axeCounts[indicator.axe._id].donnees++;
      }
    });

    return Object.values(axeCounts)
      .filter((item) => item.indicateurs > 0 || item.donnees > 0)
      .sort((a, b) => a.numero - b.numero);
  }, [axes, indicateurs, numericData]);

  // LMMA by type
  const lmmaByType = useMemo(() => {
    const typeCounts: Record<string, number> = {};

    (qualitativeData || []).forEach((item) => {
      item.items?.forEach(
        (lmma: { loisMesuresActions: { type: { nom: string } | string } }) => {
          let typeName = "Non spécifié";
          if (typeof lmma.loisMesuresActions.type === "object") {
            typeName = lmma.loisMesuresActions.type.nom;
          } else if (typeof lmma.loisMesuresActions.type === "string") {
            typeName = lmma.loisMesuresActions.type;
          }
          typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
        }
      );
    });

    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [qualitativeData]);

  // Gender trends over time
  const genderTrends = useMemo(() => {
    const trends: Record<
      number,
      { annee: number; Homme: number; Femme: number; Total: number }
    > = {};

    (numericData || [])
      .filter((item) => !item.province)
      .forEach((item) => {
        if (!trends[item.annee]) {
          trends[item.annee] = {
            annee: item.annee,
            Homme: 0,
            Femme: 0,
            Total: 0,
          };
        }
        const sexe = item.sexe || "Total";
        trends[item.annee][sexe as "Homme" | "Femme" | "Total"]++;
      });

    return Object.values(trends).sort((a, b) => a.annee - b.annee);
  }, [numericData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de Bord Statistique
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyses et visualisations des données SN1325
        </p>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {stats.totalNationalData}
              </div>
              <div className="text-sm opacity-80">Données Nationales</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {stats.totalProvincialData}
              </div>
              <div className="text-sm opacity-80">Données Provinciales</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalLMMA}</div>
              <div className="text-sm opacity-80">Lois, Mesures & Actions</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalIndicators}</div>
              <div className="text-sm opacity-80">Indicateurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Axe Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Données par Axe Stratégique
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataByAxe}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="indicateurs" fill="#3B82F6" name="Indicateurs" />
              <Bar dataKey="donnees" fill="#10B981" name="Données encodées" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Désagrégation par Sexe
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={dataByGender}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="valeur"
                label={(entry) =>
                  `${entry.name}: ${entry.valeur} (${entry.pourcentage}%)`
                }
              >
                {dataByGender.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props) => [
                  `${value} (${props.payload.pourcentage}%)`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Temporal Analysis */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Évolution Temporelle des Données
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={dataByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="annee" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="national"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              name="National"
            />
            <Area
              type="monotone"
              dataKey="provincial"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              name="Provincial"
            />
            <Area
              type="monotone"
              dataKey="lmma"
              stackId="1"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              name="LMMA"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row 3: Provincial & Gender Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Top 10 Provinces
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataByProvince} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" name="Données" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Tendance Genre par Année
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={genderTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="annee" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Homme"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Homme"
              />
              <Line
                type="monotone"
                dataKey="Femme"
                stroke="#EC4899"
                strokeWidth={2}
                name="Femme"
              />
              <Line
                type="monotone"
                dataKey="Total"
                stroke="#6B7280"
                strokeWidth={2}
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LMMA Analysis */}
      {lmmaByType.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Répartition des Lois, Mesures & Actions
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={lmmaByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" name="Nombre" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
