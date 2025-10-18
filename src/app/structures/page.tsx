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
      <h1 className="text-3xl font-heading text-bleu-rdc dark:text-jaune-rdc mb-4">
        Structures
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Annuaire des organisations œuvrant dans les domaines Femmes, Paix et
        Sécurité.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une structure..."
          className="w-full md:w-80 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bleu-rdc dark:focus:ring-blue-500"
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 shadow bg-white dark:bg-slate-800">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Nom
              </th>
              <th className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Sigle
              </th>
              <th className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Domaine
              </th>
              <th className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Province
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {r.nom}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {r.sigle || "—"}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {r.domaine}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {r.province || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
