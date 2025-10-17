"use client";

import { useState } from "react";

type Row = {
  nom: string;
  sigle?: string;
  domaine: string;
  province?: string;
};

const sample: Row[] = [
  {
    nom: "Ministère du Genre, Famille et Enfant",
    sigle: "MGFE",
    domaine: "Gouvernementale",
    province: "Kinshasa",
  },
  { nom: "ONU Femmes", domaine: "Internationale", province: "Kinshasa" },
  { nom: "Ambassade de Norvège", domaine: "Partenaire", province: "Kinshasa" },
];

export default function StructuresPage() {
  const [q, setQ] = useState("");
  const rows = sample.filter(
    (r) =>
      r.nom.toLowerCase().includes(q.toLowerCase()) ||
      (r.sigle || "").toLowerCase().includes(q.toLowerCase()) ||
      r.domaine.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-heading text-bleu-rdc mb-4">Structures</h1>
      <p className="text-gray-700 dark:text-gray-200 mb-4">
        Annuaire des organisations œuvrant dans les domaines Femmes, Paix et
        Sécurité.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une structure..."
          className="w-full md:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bleu-rdc"
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow bg-white dark:bg-gray-900">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Sigle</th>
              <th className="px-4 py-3 font-semibold">Domaine</th>
              <th className="px-4 py-3 font-semibold">Province</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors text-gray-800 dark:text-gray-100"
              >
                <td className="px-4 py-3 font-medium">{r.nom}</td>
                <td className="px-4 py-3">{r.sigle || "—"}</td>
                <td className="px-4 py-3">{r.domaine}</td>
                <td className="px-4 py-3">{r.province || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
