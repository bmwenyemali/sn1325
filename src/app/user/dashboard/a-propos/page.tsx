"use client";

import { Shield, Users, Globe, Target, BookOpen, Mail } from "lucide-react";

export default function UserAProposPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-bleu-rdc to-blue-700 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 text-white shadow-xl">
        <Shield className="w-16 h-16 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Secrétariat National 1325</h1>
        <p className="text-xl text-blue-100 dark:text-gray-300">
          République Démocratique du Congo
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="w-6 h-6 mr-3 text-bleu-rdc dark:text-jaune-rdc" />
          Notre Mission
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Le Secrétariat National 1325 est chargé de coordonner la mise en œuvre
          de la Résolution 1325 du Conseil de Sécurité des Nations Unies sur les
          Femmes, la Paix et la Sécurité en République Démocratique du Congo.
          Notre mission est de promouvoir la participation des femmes dans les
          processus de paix, de prévenir les violences basées sur le genre, et
          d&apos;assurer la protection des droits des femmes dans les situations
          de conflit et post-conflit.
        </p>
      </div>

      {/* Résolution 1325 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-bleu-rdc dark:text-jaune-rdc" />
          Résolution 1325 (2000)
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Adoptée le 31 octobre 2000 par le Conseil de sécurité des Nations
          Unies, la Résolution 1325 reconnaît l&apos;impact disproportionné des
          conflits armés sur les femmes et les filles, et souligne
          l&apos;importance de leur participation égale et entière à tous les
          efforts de maintien et de promotion de la paix et de la sécurité.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              4 Piliers Fondamentaux
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Prévention</li>
              <li>• Participation</li>
              <li>• Protection</li>
              <li>• Secours et Relèvement</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Objectifs Principaux
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Participation égale des femmes</li>
              <li>• Protection contre les violences</li>
              <li>• Prévention des conflits</li>
              <li>• Reconstruction durable</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
          <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            156+
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Structures Partenaires
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
          <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            26
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Provinces Couvertes
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
          <Target className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            245+
          </div>
          <p className="text-gray-600 dark:text-gray-400">Indicateurs Suivis</p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Mail className="w-6 h-6 mr-3 text-bleu-rdc dark:text-jaune-rdc" />
          Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Adresse
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Kinshasa, République Démocratique du Congo
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Email
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              contact@sn1325.cd
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Note:</strong> Cette application est un outil de monitoring et
          de suivi pour faciliter la collecte, l&apos;analyse et le partage des
          données relatives à la mise en œuvre de la Résolution 1325 en RDC.
        </p>
      </div>
    </div>
  );
}
