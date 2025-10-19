"use client";

import Link from "next/link";
import {
  Target,
  BarChart3,
  FolderTree,
  Grid3x3,
  Crosshair,
  MapPin,
  Users,
  Calendar,
  Building2,
} from "lucide-react";

export default function ReferentielPage() {
  const referentielItems = [
    {
      title: "Axes Stratégiques",
      description: "Gérer les axes de la Résolution 1325",
      href: "/admin/dashboard/referentiel/axes",
      icon: Target,
      color: "bg-blue-500",
      iconColor: "text-blue-500",
    },
    {
      title: "Indicateurs",
      description: "Définir et affecter les indicateurs aux axes",
      href: "/admin/dashboard/referentiel/indicateurs",
      icon: BarChart3,
      color: "bg-green-500",
      iconColor: "text-green-500",
    },
    {
      title: "Grandes Catégories",
      description: "Gérer les grandes catégories d'indicateurs",
      href: "/admin/dashboard/referentiel/grandes-categories",
      icon: FolderTree,
      color: "bg-purple-500",
      iconColor: "text-purple-500",
    },
    {
      title: "Catégories",
      description: "Affecter les catégories aux grandes catégories",
      href: "/admin/dashboard/referentiel/categories",
      icon: Grid3x3,
      color: "bg-yellow-500",
      iconColor: "text-yellow-500",
    },
    {
      title: "Cibles",
      description: "Définir les cibles et les lier aux catégories",
      href: "/admin/dashboard/referentiel/cibles",
      icon: Crosshair,
      color: "bg-red-500",
      iconColor: "text-red-500",
    },
    {
      title: "Provinces",
      description: "Gérer les provinces de la RDC",
      href: "/admin/dashboard/referentiel/provinces",
      icon: MapPin,
      color: "bg-indigo-500",
      iconColor: "text-indigo-500",
    },
    {
      title: "Sexe",
      description: "Gérer les catégories de sexe",
      href: "/admin/dashboard/referentiel/sexe",
      icon: Users,
      color: "bg-pink-500",
      iconColor: "text-pink-500",
    },
    {
      title: "Années",
      description: "Gérer les années de référence",
      href: "/admin/dashboard/referentiel/annees",
      icon: Calendar,
      color: "bg-orange-500",
      iconColor: "text-orange-500",
    },
    {
      title: "Types de Structure",
      description: "Gérer les types de structures",
      href: "/admin/dashboard/referentiel/type",
      icon: Building2,
      color: "bg-teal-500",
      iconColor: "text-teal-500",
    },
  ];

  return (
    <div className="container-rdc py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestion des Référentiels
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez tous les référentiels du système : axes, indicateurs,
          catégories, cibles, provinces, etc.
        </p>
      </div>

      {/* Grid of Referentiel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referentielItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group block bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-bleu-rdc dark:hover:border-jaune-rdc"
            >
              <div className="p-6">
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-bleu-rdc dark:group-hover:text-jaune-rdc transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-bleu-rdc dark:text-jaune-rdc opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Gérer</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 À propos des référentiels
        </h2>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Les référentiels sont les données de base du système. Ils permettent
          de structurer et d&apos;organiser toutes les informations liées à la
          Résolution 1325. Assurez-vous que ces données sont à jour pour
          garantir la qualité des rapports et statistiques.
        </p>
      </div>

      {/* Relationships Info */}
      <div className="mt-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🔗 Relations entre référentiels
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>
              <strong>Indicateurs</strong> sont liés aux <strong>Axes</strong>
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>
              <strong>Catégories</strong> sont liées aux{" "}
              <strong>Grandes Catégories</strong>
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <span>
              <strong>Cibles</strong> sont liées aux <strong>Catégories</strong>
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">•</span>
            <span>
              <strong>Structures</strong> sont liées aux{" "}
              <strong>Types de Structure</strong> et <strong>Provinces</strong>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
