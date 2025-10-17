"use client";

import { motion } from "framer-motion";
import { ChevronDown, Calendar, Globe, Users2 } from "lucide-react";

export function Hero() {
  const scrollToLogin = () => {
    document.getElementById("login")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background avec drapeau RDC stylisé */}
      <div className="absolute inset-0 bg-gradient-to-br from-bleu-rdc via-bleu-rdc-600 to-bleu-rdc-800"></div>

      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-jaune-rdc opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-rouge-rdc opacity-10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-jaune-rdc opacity-5 rounded-full blur-lg"></div>

      <div className="relative z-10 container-rdc text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
          >
            <Calendar className="w-4 h-4 text-jaune-rdc" />
            <span className="text-sm font-medium">
              Résolution 1325 - 25 ans de mise en œuvre
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="block">Secrétariat National</span>
            <span className="block text-jaune-rdc">1325</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-blue-100 mt-2">
              République Démocratique du Congo
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Application de monitoring et de suivi de la mise en œuvre de la
            Résolution 1325 du Conseil de Sécurité des Nations Unies sur les
            <span className="text-jaune-rdc font-semibold">
              {" "}
              Femmes, la Paix et la Sécurité
            </span>
          </motion.p>

          {/* Statistiques rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-jaune-rdc" />
                <span className="text-2xl font-bold">26</span>
              </div>
              <p className="text-sm text-blue-200">Provinces couvertes</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users2 className="w-5 h-5 text-jaune-rdc" />
                <span className="text-2xl font-bold">5</span>
              </div>
              <p className="text-sm text-blue-200">Axes stratégiques</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-jaune-rdc" />
                <span className="text-2xl font-bold">25</span>
              </div>
              <p className="text-sm text-blue-200">Années de suivi</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <button
              onClick={scrollToLogin}
              className="bg-jaune-rdc hover:bg-jaune-rdc-600 text-bleu-rdc font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Accéder à la plateforme
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white text-white hover:bg-white hover:text-bleu-rdc font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              En savoir plus
            </button>
          </motion.div>
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center space-y-2 text-white/70"
          >
            <span className="text-sm">Découvrir</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
