export const metadata = {
  title: "À propos - SN1325 RDC",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-slate-700">
        <h1 className="text-4xl md:text-5xl font-heading text-bleu-rdc dark:text-jaune-rdc mb-6">
          À propos
        </h1>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-8">
          Cette base de données soutient le suivi et l&apos;évaluation de la
          mise en œuvre de la Résolution 1325 sur les Femmes, la Paix et la
          Sécurité en République Démocratique du Congo. Elle facilite la
          collecte, l&apos;analyse et la visualisation des données clés au
          niveau national et provincial.
        </p>

        <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
          Objectifs
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300 text-lg">
          <li>
            Centraliser les indicateurs liés aux axes de la R1325
            (Participation, Protection, Prévention, Relèvement, Coordination)
          </li>
          <li>
            Améliorer la qualité, la lisibilité et la diffusion des rapports
          </li>
          <li>
            Renforcer la coordination entre les structures gouvernementales et
            partenaires
          </li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-6 text-gray-900 dark:text-white">
          Partenaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-bleu-rdc to-bleu-rdc-700 dark:from-slate-700 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <h3 className="font-semibold text-lg text-white mb-2">
              Ministère du Genre, Famille et Enfant
            </h3>
            <p className="text-sm text-blue-100 dark:text-gray-300">
              Coordination nationale
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <h3 className="font-semibold text-lg text-white mb-2">
              ONU Femmes
            </h3>
            <p className="text-sm text-orange-100 dark:text-gray-300">
              Appui technique et financier
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <h3 className="font-semibold text-lg text-white mb-2">
              Ambassade de Norvège
            </h3>
            <p className="text-sm text-red-100 dark:text-gray-300">
              Partenaire financier
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
