"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Categorie {
  _id: string;
  nom: string;
}

interface GrandeCategorie {
  _id: string;
  nom: string;
}

interface Cible {
  _id: string;
  nom: string;
  description?: string;
  categorie: Categorie | string;
  grandeCategorie: GrandeCategorie | string;
  ordre: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function CiblesPage() {
  const [cibles, setCibles] = useState<Cible[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [grandesCategories, setGrandesCategories] = useState<GrandeCategorie[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCible, setEditingCible] = useState<Cible | null>(null);

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    categorie: "",
    grandeCategorie: "",
    ordre: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ciblesRes, categoriesRes] = await Promise.all([
        fetch("/api/cibles"),
        fetch("/api/categories"),
      ]);

      const ciblesData = await ciblesRes.json();
      const categoriesData = await categoriesRes.json();

      if (ciblesData.success) setCibles(ciblesData.data);
      if (categoriesData.success) {
        setCategories(categoriesData.data.categories || []);
        setGrandesCategories(categoriesData.data.grandesCategories || []);
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
      const method = editingCible ? "PATCH" : "POST";
      const url = editingCible
        ? `/api/cibles/${editingCible._id}`
        : "/api/cibles";

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

  const handleEdit = (cible: Cible) => {
    setEditingCible(cible);
    setFormData({
      nom: cible.nom,
      description: cible.description || "",
      categorie:
        typeof cible.categorie === "object"
          ? cible.categorie._id
          : cible.categorie,
      grandeCategorie:
        typeof cible.grandeCategorie === "object"
          ? cible.grandeCategorie._id
          : cible.grandeCategorie,
      ordre: cible.ordre,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette cible ?")) {
      try {
        const response = await fetch(`/api/cibles/${id}`, {
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
      description: "",
      categorie: "",
      grandeCategorie: "",
      ordre: 1,
    });
    setEditingCible(null);
    setShowModal(false);
  };

  const filteredCibles = cibles.filter((cible) =>
    cible.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des Cibles
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Cible</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une cible..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Grande Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ordre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCibles.map((cible) => (
              <tr
                key={cible._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {cible.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {typeof cible.categorie === "object"
                    ? cible.categorie.nom
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {typeof cible.grandeCategorie === "object"
                    ? cible.grandeCategorie.nom
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {cible.ordre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(cible)}
                    className="text-bleu-rdc hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cible._id)}
                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingCible ? "Modifier la cible" : "Nouvelle cible"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grande Catégorie *
                  </label>
                  <select
                    required
                    value={formData.grandeCategorie}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        grandeCategorie: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner une grande catégorie</option>
                    {grandesCategories.map((gc) => (
                      <option key={gc._id} value={gc._id}>
                        {gc.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={formData.categorie}
                    onChange={(e) =>
                      setFormData({ ...formData, categorie: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nom}
                      </option>
                    ))}
                  </select>
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
                        ordre: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingCible ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
