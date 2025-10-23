"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, BarChart } from "lucide-react";

interface Axe {
  _id: string;
  nom: string;
  couleur: string;
}

interface Indicateur {
  _id: string;
  nom: string;
  code: string;
  description: string;
  type: "quantitatif" | "qualitatif";
  axe: Axe | string;
  unitesMesure: string[];
  frequenceCollecte:
    | "mensuelle"
    | "trimestrielle"
    | "semestrielle"
    | "annuelle";
  statut: "actif" | "inactif";
  desagregableParSexe: boolean;
  desagregableParProvince: boolean;
  desagregableParAnnee: boolean;
  avecCible: boolean;
  dateCreation: Date;
  dateModification: Date;
}

export default function IndicateursPage() {
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
  const [axes, setAxes] = useState<Axe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAxe, setFilterAxe] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingIndicateur, setEditingIndicateur] = useState<Indicateur | null>(
    null
  );
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    description: "",
    type: "quantitatif" as "quantitatif" | "qualitatif",
    axe: "",
    unitesMesure: [""],
    frequenceCollecte: "trimestrielle" as
      | "mensuelle"
      | "trimestrielle"
      | "semestrielle"
      | "annuelle",
    statut: "actif" as "actif" | "inactif",
    desagregableParSexe: false,
    desagregableParProvince: false,
    desagregableParAnnee: true,
    avecCible: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch axes
      const axesRes = await fetch("/api/axes");
      const axesData = await axesRes.json();
      if (axesData.success) setAxes(axesData.data);

      // Fetch indicateurs
      const res = await fetch("/api/indicateurs");
      const data = await res.json();
      if (data.success) {
        setIndicateurs(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingIndicateur ? "PATCH" : "POST";
      const url = editingIndicateur
        ? `/api/indicateurs/${editingIndicateur._id}`
        : "/api/indicateurs";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchData();
        resetForm();
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (indicateur: Indicateur) => {
    setEditingIndicateur(indicateur);
    setFormData({
      nom: indicateur.nom,
      code: indicateur.code,
      description: indicateur.description,
      type: indicateur.type,
      axe:
        typeof indicateur.axe === "object"
          ? indicateur.axe._id
          : indicateur.axe,
      unitesMesure: indicateur.unitesMesure || [""],
      frequenceCollecte: indicateur.frequenceCollecte || "trimestrielle",
      statut: indicateur.statut || "actif",
      desagregableParSexe: indicateur.desagregableParSexe || false,
      desagregableParProvince: indicateur.desagregableParProvince || false,
      desagregableParAnnee: indicateur.desagregableParAnnee !== false,
      avecCible: indicateur.avecCible || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet indicateur ?")) {
      try {
        const response = await fetch(`/api/indicateurs/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
          await fetchData();
        } else {
          alert("Erreur: " + result.error);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      code: "",
      description: "",
      type: "quantitatif",
      axe: "",
      unitesMesure: [""],
      frequenceCollecte: "trimestrielle",
      statut: "actif",
      desagregableParSexe: false,
      desagregableParProvince: false,
      desagregableParAnnee: true,
      avecCible: false,
    });
    setEditingIndicateur(null);
    setShowModal(false);
  };

  const addUniteMesure = () => {
    setFormData((prev) => ({
      ...prev,
      unitesMesure: [...prev.unitesMesure, ""],
    }));
  };

  const removeUniteMesure = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      unitesMesure: prev.unitesMesure.filter((_, i) => i !== index),
    }));
  };

  const updateUniteMesure = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      unitesMesure: prev.unitesMesure.map((unite, i) =>
        i === index ? value : unite
      ),
    }));
  };

  const filteredIndicateurs = indicateurs.filter((indicateur) => {
    const matchesSearch =
      !searchTerm ||
      indicateur.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicateur.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicateur.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const axeId =
      typeof indicateur.axe === "object" ? indicateur.axe._id : indicateur.axe;
    const matchesAxe = !filterAxe || axeId === filterAxe;
    const matchesType = !filterType || indicateur.type === filterType;

    return matchesSearch && matchesAxe && matchesType;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestion des Indicateurs
        </h1>
        <p className="text-gray-600">
          Gérez les indicateurs de suivi pour chaque axe de la résolution 1325
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un indicateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filterAxe}
            onChange={(e) => setFilterAxe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
          >
            <option value="">Tous les axes</option>
            {axes.map((axe) => (
              <option key={axe._id} value={axe._id}>
                {axe.nom}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="quantitatif">Quantitatif</option>
            <option value="qualitatif">Qualitatif</option>
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-bleu-rdc-700"
          >
            <Plus className="w-4 h-4" />
            Nouvel Indicateur
          </button>
        </div>
      </div>

      {/* Indicateurs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Indicateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Axe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fréquence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIndicateurs.map((indicateur) => (
                <tr key={indicateur._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {indicateur.nom}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                        {indicateur.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-600">
                      {indicateur.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {typeof indicateur.axe === "object"
                        ? indicateur.axe.nom
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BarChart className="w-4 h-4 mr-2 text-gray-400" />
                      <span
                        className={`capitalize ${
                          indicateur.type === "quantitatif"
                            ? "text-green-600"
                            : "text-purple-600"
                        }`}
                      >
                        {indicateur.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">
                      {indicateur.frequenceCollecte}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        indicateur.statut === "actif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {indicateur.statut === "actif" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(indicateur)}
                        className="text-bleu-rdc hover:text-bleu-rdc-700 p-1 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(indicateur._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingIndicateur
                ? "Modifier l&apos;Indicateur"
                : "Nouvel Indicateur"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l&apos;indicateur
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nom: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent font-mono"
                    placeholder="EX: PART_001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Axe
                  </label>
                  <select
                    required
                    value={formData.axe}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        axe: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  >
                    <option value="">Sélectionner un axe</option>
                    {axes.map((axe) => (
                      <option key={axe._id} value={axe._id}>
                        {axe.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value as "quantitatif" | "qualitatif",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  >
                    <option value="quantitatif">Quantitatif</option>
                    <option value="qualitatif">Qualitatif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fréquence de collecte
                  </label>
                  <select
                    value={formData.frequenceCollecte}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        frequenceCollecte: e.target.value as
                          | "mensuelle"
                          | "trimestrielle"
                          | "semestrielle"
                          | "annuelle",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  >
                    <option value="mensuelle">Mensuelle</option>
                    <option value="trimestrielle">Trimestrielle</option>
                    <option value="semestrielle">Semestrielle</option>
                    <option value="annuelle">Annuelle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unités de mesure
                </label>
                <div className="space-y-2">
                  {formData.unitesMesure.map((unite, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={unite}
                        onChange={(e) =>
                          updateUniteMesure(index, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                        placeholder="Ex: %, nombre, cas, échelle 1-5"
                      />
                      {formData.unitesMesure.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUniteMesure(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addUniteMesure}
                    className="text-bleu-rdc hover:text-bleu-rdc-700 text-sm font-medium"
                  >
                    + Ajouter une unité
                  </button>
                </div>
              </div>

              {/* Options de désagrégation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Options de désagrégation
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.desagregableParSexe}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desagregableParSexe: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Désagrégable par sexe
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.desagregableParProvince}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desagregableParProvince: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Désagrégable par province
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.desagregableParAnnee}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desagregableParAnnee: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Désagrégable par année
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.avecCible}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          avecCible: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Avec cible
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      statut: e.target.value as "actif" | "inactif",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-bleu-rdc-700"
                >
                  {editingIndicateur ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
