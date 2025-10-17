"use client";

import { motion } from "framer-motion";
import { Shield, Target, Heart, Handshake, Users } from "lucide-react";

export function About() {
  const pillars = [
    {
      icon: Shield,
      title: "Prévention",
      description:
        "Mécanismes d'alerte précoce et action avant l'éclatement des conflits",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Users,
      title: "Participation",
      description:
        "Participation des femmes aux instances de prise de décision pour la paix",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Heart,
      title: "Protection",
      description:
        "Protection des droits des femmes et lutte contre l'impunité",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Handshake,
      title: "Relèvement",
      description: "Intégration du genre dans les projets post-conflit",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Target,
      title: "Coordination",
      description: "Suivi et évaluation des mécanismes de coordination",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container-rdc">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-bleu-rdc mb-6">
            À propos de la Résolution 1325
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Adoptée le 31 octobre 2000 par le Conseil de Sécurité des Nations
            Unies, la Résolution 1325 est un instrument juridique fondamental
            qui promeut les droits des femmes dans les situations de conflit et
            encourage leur participation active aux processus de paix et de
            sécurité.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-bleu-rdc-50 to-blue-50 rounded-2xl p-8 md:p-12 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-bleu-rdc mb-6">
                Notre Mission
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Le Secrétariat National 1325 de la République Démocratique du
                Congo coordonne et supervise la mise en œuvre de la Résolution
                1325, en collectant et analysant les données sur les progrès
                réalisés dans la promotion des droits des femmes en matière de
                paix et sécurité.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-bleu-rdc rounded-full"></div>
                  <span className="text-gray-700">
                    Collecte et analyse de données
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-bleu-rdc rounded-full"></div>
                  <span className="text-gray-700">
                    Suivi des indicateurs nationaux
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-bleu-rdc rounded-full"></div>
                  <span className="text-gray-700">Rapports périodiques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-bleu-rdc rounded-full"></div>
                  <span className="text-gray-700">
                    Coordination multi-sectorielle
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-6 shadow-rdc">
                <div className="text-center">
                  <div className="w-16 h-16 bg-bleu-rdc rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-bleu-rdc mb-2">
                    Ministère du Genre, Famille et Enfant
                  </h4>
                  <p className="text-gray-600">
                    République Démocratique du Congo
                  </p>
                </div>
              </div>
              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-jaune-rdc rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-rouge-rdc rounded-full opacity-60"></div>
            </div>
          </div>
        </motion.div>

        {/* Les 5 Axes Stratégiques */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center text-bleu-rdc mb-12">
            Les Cinq Axes Stratégiques
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-rdc hover:shadow-rdc-lg transition-all duration-300 border border-gray-100 hover:border-bleu-rdc-200 group"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${pillar.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold text-bleu-rdc mb-3">
                  {pillar.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Citation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-light text-bleu-rdc italic max-w-4xl mx-auto leading-relaxed">
            &ldquo;La participation des femmes à la paix et à la sécurité est
            essentielle pour construire une société plus juste et
            durable.&rdquo;
          </blockquote>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-12 h-1 bg-bleu-rdc rounded"></div>
            <div className="w-12 h-1 bg-jaune-rdc rounded"></div>
            <div className="w-12 h-1 bg-rouge-rdc rounded"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
