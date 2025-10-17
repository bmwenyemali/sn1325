"use client";

import Link from "next/link";
import { Shield, ArrowRight, Users, BarChart3, FileCheck } from "lucide-react";

export function LoginCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-bleu-rdc via-bleu-rdc-600 to-bleu-rdc-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-jaune-rdc rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-rouge-rdc rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-jaune-rdc rotate-12"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-jaune-rdc rounded-full"></div>
      </div>

      <div className="container-rdc relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre principal */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-jaune-rdc" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Accédez à la Plateforme
              <span className="block text-jaune-rdc mt-2">SN1325</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Rejoignez le système de monitoring de la Résolution 1325 et
              contribuez au renforcement de la participation des femmes à la
              paix et à la sécurité en République Démocratique du Congo.
            </p>
          </div>

          {/* Fonctionnalités clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-jaune-rdc rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-bleu-rdc" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Gestion des Données
              </h3>
              <p className="text-blue-200 text-sm">
                Saisissez et gérez les données de mise en œuvre dans toutes les
                provinces
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-jaune-rdc rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-bleu-rdc" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analyses Statistiques
              </h3>
              <p className="text-blue-200 text-sm">
                Visualisez les progrès et tendances avec des rapports détaillés
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-jaune-rdc rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6 text-bleu-rdc" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Rapports Officiels
              </h3>
              <p className="text-blue-200 text-sm">
                Générez des rapports officiels pour le suivi et l'évaluation
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signin"
              className="group bg-jaune-rdc hover:bg-jaune-rdc-600 text-bleu-rdc font-semibold px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
            >
              <span className="text-lg">Se connecter</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="text-center sm:text-left">
              <p className="text-blue-200 text-sm mb-1">
                Compte administrateur :
              </p>
              <div className="text-white text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <strong>admin@sn1325.cd</strong> • admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
