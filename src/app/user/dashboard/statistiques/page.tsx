"use client";

import { BarChart3, TrendingUp, PieChart, LineChart } from "lucide-react";

export default function UserStatistiquesPage() {
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

      {/* Chart Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <BarChart3 className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Graphiques en Barres</h3>
          <p className="text-blue-100 text-sm">Comparaisons et évolutions</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <PieChart className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Graphiques Circulaires</h3>
          <p className="text-green-100 text-sm">Répartitions et proportions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <LineChart className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Graphiques Linéaires</h3>
          <p className="text-purple-100 text-sm">Tendances temporelles</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <TrendingUp className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Analyses de Tendances</h3>
          <p className="text-orange-100 text-sm">Prévisions et projections</p>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Aperçu des Indicateurs par Axe Stratégique
        </h2>
        <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Les graphiques seront affichés ici
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Sélectionnez un axe ou indicateur pour visualiser les données
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Taux de Réalisation
          </h3>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            72%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Moyenne tous axes confondus
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Évolution Annuelle
          </h3>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            +15%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Par rapport à l&apos;année précédente
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Provinces Actives
          </h3>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            26/26
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Couverture nationale complète
          </p>
        </div>
      </div>
    </div>
  );
}
