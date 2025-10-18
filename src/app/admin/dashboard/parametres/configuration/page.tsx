"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";

interface ConfigData {
  appName: string;
  appDescription: string;
  supportEmail: string;
  supportPhone: string;
  maxUploadSize: number;
  defaultLanguage: string;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  maintenanceMode: boolean;
}

export default function ConfigurationPage() {
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<ConfigData>({
    appName: "SN1325 - Système National de Suivi",
    appDescription:
      "Système national de suivi de la résolution 1325 du Conseil de Sécurité des Nations Unies",
    supportEmail: "support@sn1325.bi",
    supportPhone: "+257 22 XX XX XX",
    maxUploadSize: 5,
    defaultLanguage: "fr",
    enableNotifications: true,
    enableAnalytics: false,
    maintenanceMode: false,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save configuration
      // const response = await fetch("/api/configuration", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(config),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Configuration enregistrée avec succès");
    } catch (error) {
      console.error("Error saving configuration:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configuration
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Paramètres généraux de l&apos;application
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl">
        <div className="space-y-6">
          {/* General Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informations Générales
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de l&apos;application
                </label>
                <input
                  type="text"
                  value={config.appName}
                  onChange={(e) =>
                    setConfig({ ...config, appName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={config.appDescription}
                  onChange={(e) =>
                    setConfig({ ...config, appDescription: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact et Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email de support
                </label>
                <input
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) =>
                    setConfig({ ...config, supportEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Téléphone de support
                </label>
                <input
                  type="tel"
                  value={config.supportPhone}
                  onChange={(e) =>
                    setConfig({ ...config, supportPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Paramètres Système
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Taille maximale des fichiers (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.maxUploadSize}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxUploadSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Langue par défaut
                </label>
                <select
                  value={config.defaultLanguage}
                  onChange={(e) =>
                    setConfig({ ...config, defaultLanguage: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="rn">Kirundi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Fonctionnalités
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableNotifications"
                  checked={config.enableNotifications}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      enableNotifications: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="enableNotifications"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Activer les notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAnalytics"
                  checked={config.enableAnalytics}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      enableAnalytics: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="enableAnalytics"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Activer les analytics
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={config.maintenanceMode}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="maintenanceMode"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Mode maintenance{" "}
                  <span className="text-red-500 text-xs">
                    (Désactiver l&apos;accès)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
