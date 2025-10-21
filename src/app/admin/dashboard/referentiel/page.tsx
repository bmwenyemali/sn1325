"use client";

import { useState, Suspense } from "react";
import {
  Target,
  BarChart3,
  Crosshair,
  MapPin,
  Calendar,
  Loader2,
  Scale,
} from "lucide-react";

// Import dynamique des pages existantes
import AxesPage from "./axes/page";
import IndicateursPage from "./indicateurs/page";
import CiblesPage from "./cibles/page";
import ProvincesPage from "./provinces/page";
import AnneesPage from "./annees/page";
import LoisMesuresActionsPage from "./lois-mesures-actions/page";

type TabType =
  | "axes"
  | "indicateurs"
  | "cibles"
  | "provinces"
  | "annees"
  | "lmma";

interface TabConfig {
  id: TabType;
  label: string;
  icon: typeof Target;
  color: string;
  component: React.ComponentType;
}

const tabs: TabConfig[] = [
  {
    id: "axes",
    label: "Axes Stratégiques",
    icon: Target,
    color: "text-blue-600 dark:text-blue-400",
    component: AxesPage,
  },
  {
    id: "indicateurs",
    label: "Indicateurs",
    icon: BarChart3,
    color: "text-green-600 dark:text-green-400",
    component: IndicateursPage,
  },
  {
    id: "cibles",
    label: "Cibles",
    icon: Crosshair,
    color: "text-red-600 dark:text-red-400",
    component: CiblesPage,
  },
  {
    id: "provinces",
    label: "Provinces",
    icon: MapPin,
    color: "text-indigo-600 dark:text-indigo-400",
    component: ProvincesPage,
  },
  {
    id: "annees",
    label: "Années",
    icon: Calendar,
    color: "text-orange-600 dark:text-orange-400",
    component: AnneesPage,
  },
  {
    id: "lmma",
    label: "Lois, Mesures & Actions",
    icon: Scale,
    color: "text-purple-600 dark:text-purple-400",
    component: LoisMesuresActionsPage,
  },
];

export default function ReferentielPage() {
  const [activeTab, setActiveTab] = useState<TabType>("axes");

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || AxesPage;

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

        {/* Tab Content - Remove padding as each page has its own */}
        <div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            }
          >
            <ActiveComponent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
