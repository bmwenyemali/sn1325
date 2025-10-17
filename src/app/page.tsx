"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart, Users, Shield, CheckCircle } from "lucide-react";
import CtaLink from "@/components/home/CtaLink";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      {/* Section Héros */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bleu-rdc via-bleu-rdc-600 to-bleu-rdc-800 dark:from-slate-900 dark:via-bleu-rdc-900 dark:to-slate-950 p-16 md:p-20 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-jaune-rdc rounded-full mb-6 shadow-lg animate-bounce-gentle">
            <Shield className="w-10 h-10 text-bleu-rdc" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-heading mb-6 animate-fade-in">
            Secrétariat National 1325
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in">
            Application de monitoring et de suivi de la mise en œuvre de la
            Résolution 1325 du Conseil de Sécurité des Nations Unies sur les
            Femmes, la Paix et la Sécurité en République Démocratique du Congo.
          </p>
          <div className="mt-10 animate-fade-in">
            <CtaLink />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-jaune-rdc rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-rouge-rdc rounded-full opacity-10 blur-3xl"></div>
      </section>

      {/* Section des statistiques clés */}
      <section className="animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 font-heading">
          Impact National
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="w-8 h-8 text-white" />}
            title="Provinces Couvertes"
            value="26"
            description="Suivi national complet"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<Shield className="w-8 h-8 text-white" />}
            title="Axes Stratégiques"
            value="5"
            description="Piliers du plan d'action"
            gradient="from-green-500 to-green-600"
          />
          <StatCard
            icon={<BarChart className="w-8 h-8 text-white" />}
            title="Indicateurs Suivis"
            value="75+"
            description="Mesure de l'impact"
            gradient="from-orange-500 to-orange-600"
          />
          <StatCard
            icon={<CheckCircle className="w-8 h-8 text-white" />}
            title="Rapports Générés"
            value="120+"
            description="Analyses et évaluations"
            gradient="from-red-500 to-red-600"
          />
        </div>
      </section>

      {/* Section À propos */}
      <section className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-bleu-rdc dark:text-jaune-rdc mb-8 font-heading">
          À Propos de la Résolution 1325
        </h2>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            La résolution 1325, adoptée en 2000 par le Conseil de sécurité de
            l&apos;ONU, est un cadre juridique et politique historique. Elle
            reconnaît l&apos;impact disproportionné des conflits armés sur les
            femmes et les filles et souligne leur rôle essentiel dans la
            prévention des conflits, la consolidation de la paix et la
            reconstruction. La RDC s&apos;est engagée, à travers son Plan
            d&apos;Action National, à mettre en œuvre cette résolution sur
            l&apos;ensemble de son territoire.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-bleu-rdc dark:bg-jaune-rdc rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white dark:text-bleu-rdc" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Participation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accroître la représentation des femmes
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-vert-espoir dark:bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Protection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Protéger les droits des femmes
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-urgence dark:bg-orange-500 rounded-lg flex items-center justify-center">
              <BarChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Prévention
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Prévenir les violences basées sur le genre
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const StatCard = ({
  icon,
  title,
  value,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  gradient: string;
}) => (
  <Card className="group hover:scale-105 transition-all duration-300 border-none shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </CardTitle>
      <div
        className={`p-3 rounded-lg bg-gradient-to-br ${gradient} shadow-md group-hover:shadow-xl transition-shadow`}
      >
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);
