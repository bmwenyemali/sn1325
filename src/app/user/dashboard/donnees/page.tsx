"use client";

import { useState } from "react";
import { Database, ListChecks, MapPin } from "lucide-react";

type TabType = "national" | "provincial" | "qualitative";

export default function UserDonneesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("national");

  const tabs = [
    {
      id: "national" as TabType,
      label: "Données Nationales",
      icon: Database,
      description: "Consultez les données numériques au niveau national",
    },
    {
      id: "provincial" as TabType,
      label: "Données Provinciales",
      icon: MapPin,
      description: "Consultez les données numériques par province",
    },
    {
      id: "qualitative" as TabType,
      label: "Lois, Mesures & Actions",
      icon: ListChecks,
      description: "Consultez les lois, mesures, mécanismes et actions",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Données de la Résolution 1325
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez les données numériques et qualitatives
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={isActive ? "border-bleu-rdc text-bleu-rdc" : "border-transparent text-gray-500"}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <p>Tab content: {activeTab}</p>
        </div>
      </div>
    </div>
  );
}
