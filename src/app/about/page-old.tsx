export const metadata = {
  title: "À propos - SN1325 RDC",
};

export default function AboutPage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1 className="text-4xl font-heading text-bleu-rdc mb-4">À propos</h1>
      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
        Cette base de données soutient le suivi et l&apos;évaluation de la mise
        en œuvre de la Résolution 1325 sur les Femmes, la Paix et la Sécurité en
        République Démocratique du Congo. Elle facilite la collecte,
        l&apos;analyse et la visualisation des données clés au niveau national
        et provincial.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Objectifs</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
        <li>
          Centraliser les indicateurs liés aux axes de la R1325 (Participation,
          Protection, Prévention, Relèvement, Coordination)
        </li>
        <li>
          Améliorer la qualité, la lisibilité et la diffusion des rapports
        </li>
        <li>
          Renforcer la coordination entre les structures gouvernementales et
          partenaires
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Partenaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
          <h3 className="font-semibold">
            Ministère du Genre, Famille et Enfant
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Coordination nationale
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
          <h3 className="font-semibold">ONU Femmes</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Appui technique et financier
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
          <h3 className="font-semibold">Ambassade de Norvège</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Partenaire financier
          </p>
        </div>
      </div>
    </div>
  );
}
