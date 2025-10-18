"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

interface SexeOption {
  _id: string;
  nom: string;
  code: string;
  description: string;
  ordre: number;
}

export default function SexePage() {
  const [sexeOptions, setSexeOptions] = useState<SexeOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/sexe");
      const data = await response.json();

      if (data.success) {
        setSexeOptions(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bleu-rdc border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Référentiel Sexe
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Catégories de désagrégation par sexe utilisées dans le système
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sexeOptions.map((option) => (
          <div
            key={option._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-bleu-rdc"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-bleu-rdc bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-bleu-rdc" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {option.nom}
                </h3>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-bleu-rdc text-white">
                  Code: {option.code}
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {option.description}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Ordre d&apos;affichage: {option.ordre}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Information
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Les catégories de sexe sont un référentiel système statique utilisé
          pour la désagrégation des données. Ces valeurs ne peuvent pas être
          modifiées et sont utilisées dans l&apos;ensemble du système de
          collecte de données.
        </p>
      </div>
    </div>
  );
}
