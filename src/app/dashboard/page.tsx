"use client";

import { useSession } from "next-auth/react";
import {
  BarChart3,
  Users,
  Database,
  FileText,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = [
    {
      name: "Total Indicateurs",
      value: "245",
      change: "+12%",
      changeType: "increase",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      name: "Données Validées",
      value: "1,832",
      change: "+18%",
      changeType: "increase",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      name: "En Attente",
      value: "23",
      change: "-4%",
      changeType: "decrease",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      name: "Utilisateurs Actifs",
      value: "48",
      change: "+7%",
      changeType: "increase",
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "data_entry",
      message:
        'Nouvelle saisie de données pour l\'indicateur "Femmes au Gouvernement"',
      user: "Marie Mukendi",
      time: "Il y a 2 heures",
      status: "pending",
    },
    {
      id: 2,
      type: "validation",
      message: "Validation des données Nord-Kivu pour Q3 2025",
      user: "Joseph Kabila",
      time: "Il y a 4 heures",
      status: "completed",
    },
    {
      id: 3,
      type: "report",
      message: "Export du rapport mensuel généré",
      user: "Système",
      time: "Il y a 1 jour",
      status: "completed",
    },
  ];

  const quickActions = [
    {
      name: "Saisir des données",
      description: "Ajouter de nouvelles données d'indicateurs",
      href: "/dashboard/donnees/saisie",
      icon: Database,
      color: "bg-blue-500",
    },
    {
      name: "Valider données",
      description: "Réviser et valider les données en attente",
      href: "/dashboard/donnees/validation",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      name: "Générer rapport",
      description: "Créer un nouveau rapport statistique",
      href: "/dashboard/rapports/statistiques",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      name: "Gérer utilisateurs",
      description: "Administrer les comptes utilisateurs",
      href: "/dashboard/utilisateurs",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-bleu-rdc to-bleu-rdc-700 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Bienvenue, {session?.user?.prenom} !
              </h1>
              <p className="text-blue-100 mt-1">
                Tableau de bord - Application SN1325 RDC
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Dernière connexion:{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp
                    className={`w-4 h-4 mr-1 ${
                      stat.changeType === "increase"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs mois dernier
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className="block p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-bleu-rdc dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-bleu-rdc dark:group-hover:text-blue-400">
                        {action.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Aperçu des progrès
            </h2>
            <div className="space-y-4">
              {[
                { label: "Participation", value: 75, color: "bg-blue-500" },
                { label: "Protection", value: 68, color: "bg-green-500" },
                { label: "Prévention", value: 82, color: "bg-yellow-500" },
                { label: "Relèvement", value: 59, color: "bg-purple-500" },
                { label: "Coordination", value: 71, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Activités récentes
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-5">
                      {activity.message}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.user}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        •
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-bleu-rdc dark:text-blue-400 font-medium hover:text-bleu-rdc-700 dark:hover:text-blue-300 transition-colors">
              Voir toutes les activités →
            </button>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              État du système
            </h2>
            <div className="space-y-3">
              {[
                { label: "Base de données", status: "online", icon: Database },
                { label: "API Services", status: "online", icon: Globe },
                { label: "Sauvegardes", status: "warning", icon: Shield },
                { label: "Notifications", status: "online", icon: AlertCircle },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "online"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status === "online" ? "En ligne" : "Attention"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
