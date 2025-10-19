"use client";

import { useState, Suspense } from "react";
import {
  Home,
  Database,
  BarChart3,
  Building2,
  FileText,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import page components
const DashboardHomePage = dynamic(
  () => import("./page_original").then((mod) => ({ default: mod.default })),
  { ssr: false }
);
const DonneesPage = dynamic(() => import("./donnees/page"), { ssr: false });
const StatistiquesPage = dynamic(() => import("./statistiques/page"), {
  ssr: false,
});
const StructuresPage = dynamic(() => import("./structures/page"), {
  ssr: false,
});
const AProposPage = dynamic(() => import("./a-propos/page"), { ssr: false });

type TabId = "home" | "donnees" | "statistiques" | "structures" | "a-propos";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  color: string;
}

const tabs: Tab[] = [
  {
    id: "home",
    label: "Tableau de bord",
    icon: Home,
    component: DashboardHomePage,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "donnees",
    label: "Données",
    icon: Database,
    component: DonneesPage,
    color: "text-green-600 dark:text-green-400",
  },
  {
    id: "statistiques",
    label: "Statistiques",
    icon: BarChart3,
    component: StatistiquesPage,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "structures",
    label: "Structures",
    icon: Building2,
    component: StructuresPage,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "a-propos",
    label: "À propos",
    icon: FileText,
    component: AProposPage,
    color: "text-indigo-600 dark:text-indigo-400",
  },
];

export default function UserDashboardTabbedPage() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || DashboardHomePage;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex flex-wrap -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm
                    transition-colors duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? `${tab.color} border-current`
                        : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-bleu-rdc dark:text-jaune-rdc" />
            </div>
          }
        >
          <ActiveComponent />
        </Suspense>
      </div>
    </div>
  );
}
