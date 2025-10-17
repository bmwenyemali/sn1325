"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Heart,
  Handshake,
  Target,
  ArrowRight,
} from "lucide-react";

export function Axes() {
  const axes = [
    {
      id: 1,
      icon: Shield,
      title: "Prévention",
      subtitle: "Agir avant les conflits",
      description:
        "Mise en place de mécanismes d&apos;alerte précoce et développement d&apos;un cadre juridique robuste pour prévenir les conflits.",
      indicators: [
        "Mécanismes d&apos;alerte précoce (369+)",
        "Textes juridiques adoptés (30+)",
        "Femmes dans les forces armées",
        "Politiques de prévention",
      ],
      color: "bg-green-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
    },
    {
      id: 2,
      icon: Users,
      title: "Participation",
      subtitle: "Leadership féminin",
      description:
        "Accroissement de la participation des femmes dans les instances de prise de décision pour la paix et la sécurité.",
      indicators: [
        "Femmes au Gouvernement (34%)",
        "Femmes à l&apos;Assemblée (13.6%)",
        "Femmes au Sénat (17.8%)",
        "Mécanismes de paix (32%)",
      ],
      color: "bg-blue-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      id: 3,
      icon: Heart,
      title: "Protection",
      subtitle: "Droits et sécurité",
      description:
        "Protection des droits des femmes en temps de conflit et lutte contre l&apos;impunité des violences basées sur le genre.",
      indicators: [
        "Centres CISM (21 centres)",
        "Dossiers VBG traités (41.55%)",
        "Fonds de réparation FONAREV",
        "Cours et tribunaux spécialisés",
      ],
      color: "bg-red-500",
      bgGradient: "from-red-50 to-pink-50",
      borderColor: "border-red-200",
    },
    {
      id: 4,
      icon: Handshake,
      title: "Relèvement",
      subtitle: "Reconstruction inclusive",
      description:
        "Intégration systématique du genre dans tous les projets de reconstruction et de développement post-conflit.",
      indicators: [
        "Femmes démobilisées DDR (3.4%)",
        "Femmes formées (128,600)",
        "Programmes post-conflit",
        "Autonomisation économique",
      ],
      color: "bg-purple-500",
      bgGradient: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
    },
    {
      id: 5,
      icon: Target,
      title: "Coordination",
      subtitle: "Suivi et évaluation",
      description:
        "Mise en place de mécanismes de coordination efficaces et de systèmes de suivi-évaluation des progrès.",
      indicators: [
        "Secrétariat National 1325",
        "Comités provinciaux",
        "Rapports périodiques",
        "Plateforme de monitoring",
      ],
      color: "bg-orange-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <section id="axes" className="py-20 bg-gray-50">
      <div className="container-rdc">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-bleu-rdc mb-6">
            Les Cinq Axes Stratégiques
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            La mise en œuvre de la Résolution 1325 en RDC s&apos;articule autour
            de cinq axes stratégiques complémentaires pour une approche
            holistique de la paix et de la sécurité.
          </p>
        </motion.div>

        <div className="space-y-8">
          {axes.map((axe, index) => (
            <motion.div
              key={axe.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${axe.bgGradient} rounded-2xl border-2 ${axe.borderColor} overflow-hidden shadow-rdc hover:shadow-rdc-lg transition-all duration-300`}
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-${
                  index % 2 === 0 ? "3" : "3"
                } gap-0`}
              >
                {/* Contenu principal */}
                <div
                  className={`lg:col-span-2 p-8 md:p-12 ${
                    index % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div
                      className={`w-16 h-16 ${axe.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <axe.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`text-2xl font-bold ${axe.color.replace(
                            "bg-",
                            "text-"
                          )}`}
                        >
                          {axe.id}.
                        </span>
                        <h3 className="text-3xl font-bold text-bleu-rdc">
                          {axe.title}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 font-medium">
                        {axe.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {axe.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {axe.indicators.map((indicator, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                      >
                        <div
                          className={`w-2 h-2 ${axe.color} rounded-full`}
                        ></div>
                        <span className="text-gray-700 text-sm font-medium">
                          {indicator}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section visuelle */}
                <div
                  className={`relative bg-white p-8 flex flex-col justify-center items-center ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div
                    className={`w-32 h-32 ${axe.color} rounded-full flex items-center justify-center mb-6 shadow-xl`}
                  >
                    <axe.icon className="w-16 h-16 text-white" />
                  </div>

                  <div className="text-center">
                    <h4 className="text-xl font-bold text-bleu-rdc mb-2">
                      Axe {axe.id}
                    </h4>
                    <p className="text-gray-600 mb-4">{axe.title}</p>

                    <button className="inline-flex items-center space-x-2 text-bleu-rdc font-medium hover:text-bleu-rdc-700 transition-colors">
                      <span>En savoir plus</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Éléments décoratifs */}
                  <div
                    className={`absolute top-4 right-4 w-6 h-6 ${axe.color} opacity-20 rounded-full`}
                  ></div>
                  <div
                    className={`absolute bottom-4 left-4 w-4 h-4 ${axe.color} opacity-30 rounded-full`}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-rdc border border-gray-200">
            <h3 className="text-3xl font-bold text-bleu-rdc mb-6">
              Contribuez au Monitoring
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez la plateforme de monitoring pour contribuer au suivi des
              indicateurs et au reporting de la Résolution 1325 en RDC.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("login")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary text-lg px-8 py-4"
            >
              Accéder à la plateforme
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
