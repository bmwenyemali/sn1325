"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";

interface Axe {
  _id: string;
  nom: string;
  description: string;
  couleur: string;
  ordre: number;
  dateCreation: Date;
  dateModification: Date;
  statut: "actif" | "inactif";
}

export default function AxesPage() {
  const [axes, setAxes] = useState<Axe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAxe, setEditingAxe] = useState<Axe | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    couleur: "#002B7F",
    ordre: 1,
    statut: "actif" as "actif" | "inactif",
  });

  useEffect(() => {
    fetchAxes();
  }, []);

  const fetchAxes = async () => {
    try {
      const response = await fetch("/api/axes");
      const result = await response.json();

      if (result.success) {
        setAxes(result.data);
      } else {
        console.error("Erreur lors du chargement:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des axes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAxe ? "PATCH" : "POST";
      const url = editingAxe ? `/api/axes/${editingAxe._id}` : "/api/axes";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list
        await fetchAxes();
        resetForm();
      } else {
        console.error("Erreur lors de la sauvegarde:", result.error);
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (axe: Axe) => {
    setEditingAxe(axe);
    setFormData({
      nom: axe.nom,
      description: axe.description,
      couleur: axe.couleur,
      ordre: axe.ordre,
      statut: axe.statut,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet axe ?")) {
      try {
        const response = await fetch(`/api/axes/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
          // Refresh the list
          await fetchAxes();
        } else {
          console.error("Erreur lors de la suppression:", result.error);
          alert("Erreur: " + result.error);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      couleur: "#002B7F",
      ordre: 1,
      statut: "actif",
    });
    setEditingAxe(null);
    setShowModal(false);
  };

  const filteredAxes = axes.filter(
    (axe) =>
      !searchTerm ||
      axe.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      axe.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Gestion des Axes
        </h1>
        <p className="text-gray-600">
          Gérez les 5 axes stratégiques de la résolution 1325
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un axe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-bleu-rdc-700"
          >
            <Plus className="w-4 h-4" />
            Nouveau Axe
          </button>
        </div>
      </div>

      {/* Axes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Axe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Modification
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAxes.map((axe) => (
                <tr key={axe._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded mr-3"
                        style={{ backgroundColor: axe.couleur }}
                      />
                      <div className="font-medium text-gray-900">{axe.nom}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {axe.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {axe.ordre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        axe.statut === "actif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {axe.statut === "actif" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {axe.dateModification
                      ? new Date(axe.dateModification).toLocaleDateString(
                          "fr-FR"
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(axe)}
                        className="text-bleu-rdc hover:text-bleu-rdc-700 p-1 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(axe._id)}
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingAxe ? "Modifier l&apos;Axe" : "Nouveau Axe"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;axe
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <input
                    type="color"
                    value={formData.couleur}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couleur: e.target.value,
                      }))
                    }
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.ordre}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ordre: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  />
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
                  {editingAxe ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
