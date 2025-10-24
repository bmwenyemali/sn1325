"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Shield,
  Users,
  TrendingUp,
  Globe,
  BarChart3,
  Database,
  Building2,
  ArrowRight,
} from "lucide-react";
import {
  useAxes,
  useIndicateurs,
  useStructures,
  useProvinces,
} from "@/hooks/useApi";

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const { data: axesData } = useAxes();
  const { data: indicateursData } = useIndicateurs();
  const { data: structuresData } = useStructures();
  const { data: provincesData } = useProvinces();

  const axes = axesData || [];
  const indicateurs = indicateursData || [];
  const structures = structuresData || [];
  const provinces = provincesData || [];

  // Map axes to display format
  const axesDisplay = axes.map((axe) => {
    const colors = [
      { color: "from-blue-500 to-blue-600", icon: Shield },
      { color: "from-purple-500 to-purple-600", icon: Users },
      { color: "from-green-500 to-green-600", icon: Shield },
      { color: "from-orange-500 to-orange-600", icon: TrendingUp },
    ];
    const style = colors[axe.numero - 1] || colors[0];
    return {
      ...axe,
      color: style.color,
      icon: style.icon,
    };
  });

  const stats = [
    {
      name: "Axes Stratégiques",
      value: axes.length.toString(),
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      name: "Total Indicateurs",
      value: indicateurs.length.toString(),
      icon: Database,
      color: "bg-green-500",
    },
    {
      name: "Structures Enregistrées",
      value: structures.length.toString(),
      icon: Building2,
      color: "bg-purple-500",
    },
    {
      name: "Provinces Couvertes",
      value: (provinces.length - 1).toString(),
      icon: Globe,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-bleu-rdc to-bleu-rdc-700 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {session?.user?.name || "Utilisateur"}
        </h1>
        <p className="text-blue-100 dark:text-gray-300">
          Consultez les données et statistiques de la Résolution 1325
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Axes Stratégiques - Main Action Buttons */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Axes Stratégiques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {axesDisplay.map((axe) => {
            const Icon = axe.icon;
            return (
              <Link
                key={axe._id}
                href={`/user/dashboard/donnees?axe=${axe._id}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`bg-gradient-to-br ${axe.color} p-8 text-white h-full`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                      Axe {axe.numero}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{axe.nom}</h3>
                  <p className="text-white/80 mb-4">
                    {axe.description || "Données disponibles"}
                  </p>
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                    Voir les données
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/user/dashboard/donnees"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Database className="w-10 h-10 text-bleu-rdc dark:text-jaune-rdc mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Toutes les Données
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Accédez à l&apos;ensemble des données enregistrées
          </p>
        </Link>

        <Link
          href="/user/dashboard/statistiques"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <BarChart3 className="w-10 h-10 text-bleu-rdc dark:text-jaune-rdc mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Statistiques
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Analyses graphiques et rapports détaillés
          </p>
        </Link>

        <Link
          href="/user/dashboard/structures"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Building2 className="w-10 h-10 text-bleu-rdc dark:text-jaune-rdc mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Structures
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Consultez les organisations partenaires
          </p>
        </Link>
      </div>
    </div>
  );
}
