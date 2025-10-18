"use client";

import { Settings, Info, Mail, Shield } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ParametresPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres du Système
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configuration et informations générales du système SN1325
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-bleu-rdc mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Configuration Système
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de l&apos;application
              </label>
              <input
                type="text"
                value="SN1325 - République Démocratique du Congo"
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Version
              </label>
              <input
                type="text"
                value="2.0.0"
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut du système
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Opérationnel
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-bleu-rdc mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Informations Utilisateur
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={`${session?.user?.prenom || ""} ${
                  session?.user?.nom || ""
                }`}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={session?.user?.email || "N/A"}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rôle
              </label>
              <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-bleu-rdc text-white">
                {session?.user?.role || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Info className="w-6 h-6 text-bleu-rdc mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              À propos
            </h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Le système SN1325 est une plateforme de suivi et de monitoring des
              indicateurs liés à la Résolution 1325 des Nations Unies sur les
              Femmes, la Paix et la Sécurité en République Démocratique du
              Congo.
            </p>
            <p>
              Ce système permet la collecte, l&apos;analyse et la visualisation
              des données relatives aux axes stratégiques du Plan d&apos;Action
              National.
            </p>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Objectifs principaux:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Suivi des indicateurs de performance</li>
                <li>Gestion des données désagrégées</li>
                <li>Génération de rapports statistiques</li>
                <li>Coordination inter-structures</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-bleu-rdc mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Contact
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Support Technique
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email: support@sn1325.gouv.cd
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ministère de tutelle
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ministère du Genre, Famille et Enfant
                <br />
                République Démocratique du Congo
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kinshasa, RDC
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heures de support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lundi - Vendredi: 8h00 - 17h00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
