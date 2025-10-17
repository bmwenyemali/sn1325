import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart, Users, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Section Héros */}
      <section className="text-center bg-white p-12 rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-bleu-rdc font-heading">
          Secrétariat National 1325
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          Application de monitoring et de suivi de la mise en œuvre de la
          Résolution 1325 du Conseil de Sécurité des Nations Unies sur les
          Femmes, la Paix et la Sécurité en République Démocratique du Congo.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="bg-jaune-rdc text-bleu-rdc font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
          >
            Accéder au Tableau de Bord
          </Link>
        </div>
      </section>

      {/* Section des statistiques clés */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="w-8 h-8 text-bleu-rdc" />}
            title="Provinces Couvertes"
            value="26"
            description="Suivi national complet"
          />
          <StatCard
            icon={<Shield className="w-8 h-8 text-vert-espoir" />}
            title="Axes Stratégiques"
            value="5"
            description="Piliers du plan d'action"
          />
          <StatCard
            icon={<BarChart className="w-8 h-8 text-orange-urgence" />}
            title="Indicateurs Suivis"
            value="75+"
            description="Mesure de l'impact"
          />
          <StatCard
            icon={<CheckCircle className="w-8 h-8 text-rouge-rdc" />}
            title="Rapports Générés"
            value="120+"
            description="Analyses et évaluations"
          />
        </div>
      </section>

      {/* Section À propos */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-bleu-rdc mb-6 font-heading">
          À Propos de la Résolution 1325
        </h2>
        <p className="text-gray-700 leading-relaxed">
          La résolution 1325, adoptée en 2000 par le Conseil de sécurité de
          l'ONU, est un cadre juridique et politique historique. Elle reconnaît
          l'impact disproportionné des conflits armés sur les femmes et les
          filles et souligne leur rôle essentiel dans la prévention des
          conflits, la consolidation de la paix et la reconstruction. La RDC
          s'est engagée, à travers son Plan d'Action National, à mettre en œuvre
          cette résolution sur l'ensemble de son territoire.
        </p>
      </section>
    </div>
  );
}

const StatCard = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold text-bleu-rdc">{value}</div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </CardContent>
  </Card>
);
