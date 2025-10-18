"use client";

import { useState } from "react";
import { Info, Save, FileText } from "lucide-react";

export default function AboutPage() {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    title: "À propos du SN1325",
    mission:
      "Le Système National de Suivi de la Résolution 1325 (SN1325) est une plateforme dédiée au suivi et à l'évaluation de la mise en œuvre de la Résolution 1325 du Conseil de Sécurité des Nations Unies au Burundi.",
    objectives: [
      "Collecter et centraliser les données sur la mise en œuvre de la Résolution 1325",
      "Faciliter le suivi des indicateurs de performance",
      "Améliorer la coordination entre les acteurs",
      "Produire des rapports périodiques pour la prise de décision",
    ],
    context:
      "La Résolution 1325 du Conseil de Sécurité des Nations Unies, adoptée en 2000, reconnaît l'impact disproportionné des conflits armés sur les femmes et les filles, et souligne l'importance de leur participation égale et entière à tous les efforts de maintien et de promotion de la paix et de la sécurité.",
    axes: [
      {
        name: "Prévention",
        description:
          "Prévenir les violences basées sur le genre et promouvoir la participation des femmes dans la prévention des conflits",
      },
      {
        name: "Participation",
        description:
          "Assurer la participation égale et significative des femmes dans tous les processus de prise de décision",
      },
      {
        name: "Protection",
        description:
          "Protéger les droits des femmes et des filles dans les situations de conflit et post-conflit",
      },
      {
        name: "Secours et Relèvement",
        description:
          "Répondre aux besoins spécifiques des femmes et des filles dans les programmes de secours et de relèvement",
      },
    ],
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save about content
      // const response = await fetch("/api/about", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(content),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Contenu enregistré avec succès");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...content.objectives];
    newObjectives[index] = value;
    setContent({ ...content, objectives: newObjectives });
  };

  const addObjective = () => {
    setContent({
      ...content,
      objectives: [...content.objectives, ""],
    });
  };

  const removeObjective = (index: number) => {
    const newObjectives = content.objectives.filter((_, i) => i !== index);
    setContent({ ...content, objectives: newObjectives });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Info className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            À propos
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gérer le contenu de la page &quot;À propos&quot;
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-5xl">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) =>
                setContent({ ...content, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Mission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mission
            </label>
            <textarea
              value={content.mission}
              onChange={(e) =>
                setContent({ ...content, mission: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contexte
            </label>
            <textarea
              value={content.context}
              onChange={(e) =>
                setContent({ ...content, context: e.target.value })
              }
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Objectives */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Objectifs
              </label>
              <button
                onClick={addObjective}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Ajouter un objectif
              </button>
            </div>
            <div className="space-y-2">
              {content.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder={`Objectif ${index + 1}`}
                  />
                  <button
                    onClick={() => removeObjective(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Axes Information (Read-only display) */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Les 4 Axes de la Résolution 1325
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.axes.map((axe, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {axe.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {axe.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500 italic">
              Les axes sont gérés dans la section Référentiel &gt; Axes
            </p>
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
