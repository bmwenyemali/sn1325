"use client";

import { useState } from "react";
import { Database, ListChecks, MapPin } from "lucide-react";
import DataNumericNationalTab from "@/components/data/DataNumericNationalTab";
import DataNumericProvincialTab from "@/components/data/DataNumericProvincialTab";
import DataQualitativeTab from "@/components/data/DataQualitativeTab";

type TabType = "national" | "provincial" | "qualitative";

export default function AdminDonneesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("national");

  const tabs = [
    {
      id: "national" as TabType,
      label: "Données Nationales",
      icon: Database,
      description: "Données numériques au niveau national",
    },
    {
      id: "provincial" as TabType,
      label: "Données Provinciales",
      icon: MapPin,
      description: "Données numériques par province",
    },
    {
      id: "qualitative" as TabType,
      label: "Données Qualitatives (LMMA)",
      icon: ListChecks,
      description: "Lois, Mesures, Mécanismes et Actions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestion des Données
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérer les données numériques nationales, provinciales et qualitatives
        </p>
      </div>

      {/* Tabs Navigation */}
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
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      isActive
                        ? "border-bleu-rdc dark:border-jaune-rdc text-bleu-rdc dark:text-jaune-rdc"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }
                  `}
                >
                  <Icon
                    className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${
                        isActive
                          ? "text-bleu-rdc dark:text-jaune-rdc"
                          : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                      }
                    `}
                  />
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "national" && <DataNumericNationalTab />}
          {activeTab === "provincial" && <DataNumericProvincialTab />}
          {activeTab === "qualitative" && <DataQualitativeTab />}
        </div>
      </div>
    </div>
  );
}
