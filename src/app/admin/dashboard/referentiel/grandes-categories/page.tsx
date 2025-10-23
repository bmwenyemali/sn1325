"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";

interface GrandeCategorie {
  _id: string;
  nom: string;
  description?: string;
  ordre?: number;
}

export default function GrandesCategoriesPage() {
  const [grandesCategories, setGrandesCategories] = useState<GrandeCategorie[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    ordre: 0,
  });

  useEffect(() => {
    fetchGrandesCategories();
  }, []);

  const fetchGrandesCategories = async () => {
    try {
      const response = await fetch("/api/grandes-categories");
      if (response.ok) {
        const data = await response.json();
        setGrandesCategories(data);
      }
    } catch (error) {
      console.error("Error fetching grandes catégories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/grandes-categories/${editingId}`
        : "/api/grandes-categories";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchGrandesCategories();
        setShowModal(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error saving grande catégorie:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (gc: GrandeCategorie) => {
    setEditingId(gc._id);
    setFormData({
      nom: gc.nom,
      description: gc.description || "",
      ordre: gc.ordre || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Êtes-vous sûr de vouloir supprimer cette grande catégorie ?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/grandes-categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchGrandesCategories();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting grande catégorie:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ nom: "", description: "", ordre: 0 });
  };

  const filteredGrandesCategories = grandesCategories.filter(
    (gc) =>
      !searchTerm || gc.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grandes Catégories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestion des grandes catégories d&apos;indicateurs
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-bleu-rdc-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Grande Catégorie
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une grande catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ordre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredGrandesCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucune grande catégorie trouvée
                </td>
              </tr>
            ) : (
              filteredGrandesCategories.map((gc) => (
                <tr
                  key={gc._id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {gc.ordre || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {gc.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {gc.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(gc)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(gc._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingId ? "Modifier" : "Nouvelle"} Grande Catégorie
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ordre
                </label>
                <input
                  type="number"
                  value={formData.ordre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ordre: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-bleu-rdc-700"
                >
                  {editingId ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
