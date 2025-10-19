"use client";

import { useState, Suspense } from "react";
import { Settings, Mail, Info, Loader2 } from "lucide-react";

// Import des pages existantes
import ConfigurationPage from "./configuration/page";
import ContactPage from "./contact/page";
import AboutPage from "./about/page";

type TabType = "configuration" | "contact" | "about";

interface TabConfig {
  id: TabType;
  label: string;
  icon: typeof Settings;
  color: string;
  component: React.ComponentType;
}

const tabs: TabConfig[] = [
  {
    id: "configuration",
    label: "Configuration",
    icon: Settings,
    color: "text-blue-600 dark:text-blue-400",
    component: ConfigurationPage,
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    color: "text-green-600 dark:text-green-400",
    component: ContactPage,
  },
  {
    id: "about",
    label: "À propos",
    icon: Info,
    color: "text-purple-600 dark:text-purple-400",
    component: AboutPage,
  },
];

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<TabType>("configuration");

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ConfigurationPage;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres du Système
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configuration et informations générales du système SN1325
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
