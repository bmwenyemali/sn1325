"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Award,
  FileText,
} from "lucide-react";

export function Stats() {
  const statistics = [
    {
      icon: Users,
      value: "34%",
      label: "Femmes au Gouvernement",
      description: "Pourcentage record atteint en 2025",
      trend: "+15%",
      color: "text-green-600",
    },
    {
      icon: MapPin,
      value: "26",
      label: "Provinces couvertes",
      description: "Présence dans toute la RDC",
      trend: "100%",
      color: "text-blue-600",
    },
    {
      icon: Award,
      value: "369+",
      label: "Mécanismes d'alerte",
      description: "Systèmes d'alerte précoce",
      trend: "+12%",
      color: "text-purple-600",
    },
    {
      icon: FileText,
      value: "30+",
      label: "Textes adoptés",
      description: "Lois et mesures juridiques",
      trend: "+8%",
      color: "text-orange-600",
    },
    {
      icon: Users,
      value: "17.8%",
      label: "Femmes au Sénat",
      description: "Représentation parlementaire",
      trend: "+5%",
      color: "text-indigo-600",
    },
    {
      icon: Calendar,
      value: "25 ans",
      label: "De mise en œuvre",
      description: "Depuis la Résolution 1325",
      trend: "Continu",
      color: "text-red-600",
    },
  ];

  const highlights = [
    {
      title: "Participation Politique",
      stats: [
        { label: "Assemblée Nationale", value: "13.6%" },
        { label: "Sénat", value: "17.8%" },
        { label: "Gouvernement", value: "34%" },
      ],
      color: "border-blue-200 bg-blue-50",
    },
    {
      title: "Sécurité et Défense",
      stats: [
        { label: "Police Nationale", value: "11%" },
        { label: "Forces Armées", value: "2-3%" },
        { label: "Mécanismes de Paix", value: "32%" },
      ],
      color: "border-green-200 bg-green-50",
    },
    {
      title: "Protection et Justice",
      stats: [
        { label: "Centres CISM", value: "21" },
        { label: "Dossiers traités", value: "41.55%" },
        { label: "Cas VBG (Nord-Kivu)", value: "7,219" },
      ],
      color: "border-red-200 bg-red-50",
    },
  ];

  return (
    <section
      id="stats"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container-rdc">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-bleu-rdc mb-6">
            Statistiques Clés
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les indicateurs phares de la mise en œuvre de la
            Résolution 1325 en République Démocratique du Congo
          </p>
        </motion.div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-rdc hover:shadow-rdc-lg transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-3xl font-bold text-bleu-rdc mb-1">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {stat.label}
                </div>
              </div>

              <p className="text-gray-600 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Sections détaillées */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center text-bleu-rdc mb-12">
            Indicateurs Détaillés par Domaine
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {highlights.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`border-2 rounded-xl p-6 ${section.color}`}
              >
                <h4 className="text-xl font-bold text-bleu-rdc mb-6 text-center">
                  {section.title}
                </h4>

                <div className="space-y-4">
                  {section.stats.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                    >
                      <span className="text-gray-700 text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="text-bleu-rdc font-bold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Évolution temporelle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-bleu-rdc rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6">25 Années de Progrès</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Depuis 2000, la RDC a considérablement progressé dans la mise en
              œuvre de la Résolution 1325, avec une amélioration continue des
              indicateurs de participation et de protection des femmes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-jaune-rdc mb-2">
                  2000
                </div>
                <div className="text-blue-200">Adoption Résolution</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-jaune-rdc mb-2">
                  2010
                </div>
                <div className="text-blue-200">Plan National</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-jaune-rdc mb-2">
                  2020
                </div>
                <div className="text-blue-200">Révision stratégique</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-jaune-rdc mb-2">
                  2025
                </div>
                <div className="text-blue-200">Monitoring digital</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
