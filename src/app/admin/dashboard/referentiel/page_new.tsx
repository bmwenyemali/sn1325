"use client";

import { useState } from "react";
import {
  Target,
  BarChart3,
  FolderTree,
  Grid3x3,
  Crosshair,
  MapPin,
  Calendar,
} from "lucide-react";

// Import des composants de chaque section
import AxesTab from "./tabs/AxesTab";
import IndicateursTab from "./tabs/IndicateursTab";
import GrandesCategoriesTab from "./tabs/GrandesCategoriesTab";
import CategoriesTab from "./tabs/CategoriesTab";
import CiblesTab from "./tabs/CiblesTab";
import ProvincesTab from "./tabs/ProvincesTab";
import AnneesTab from "./tabs/AnneesTab";

type TabType =
  | "axes"
  | "indicateurs"
  | "grandes-categories"
  | "categories"
  | "cibles"
  | "provinces"
  | "annees";

interface TabConfig {
  id: TabType;
  label: string;
  icon: typeof Target;
  color: string;
}

const tabs: TabConfig[] = [
  {
    id: "axes",
    label: "Axes Stratégiques",
    icon: Target,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "indicateurs",
    label: "Indicateurs",
    icon: BarChart3,
    color: "text-green-600 dark:text-green-400",
  },
  {
    id: "grandes-categories",
    label: "Grandes Catégories",
    icon: FolderTree,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "categories",
    label: "Catégories",
    icon: Grid3x3,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "cibles",
    label: "Cibles",
    icon: Crosshair,
    color: "text-red-600 dark:text-red-400",
  },
  {
    id: "provinces",
    label: "Provinces",
    icon: MapPin,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "annees",
    label: "Années",
    icon: Calendar,
    color: "text-orange-600 dark:text-orange-400",
  },
];

export default function ReferentielPage() {
  const [activeTab, setActiveTab] = useState<TabType>("axes");

  const renderTabContent = () => {
    switch (activeTab) {
      case "axes":
        return <AxesTab />;
      case "indicateurs":
        return <IndicateursTab />;
      case "grandes-categories":
        return <GrandesCategoriesTab />;
      case "categories":
        return <CategoriesTab />;
      case "cibles":
        return <CiblesTab />;
      case "provinces":
        return <ProvincesTab />;
      case "annees":
        return <AnneesTab />;
      default:
        return <AxesTab />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion du Référentiel
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Gérez tous les éléments de référence du système
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav
            className="flex space-x-1 overflow-x-auto px-4"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors
                    ${
                      isActive
                        ? `border-blue-500 ${tab.color}`
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}
