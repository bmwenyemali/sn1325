"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Axe {
  _id: string;
  nom: string;
  couleur: string;
}

interface GrandeCategorie {
  _id: string;
  nom: string;
  description: string;
  axe: Axe | string;
  ordre: number;
  dateCreation: Date;
  dateModification: Date;
  statut: "actif" | "inactif";
}

interface Categorie {
  _id: string;
  nom: string;
  description: string;
  grandeCategorie: GrandeCategorie | string;
  ordre: number;
  dateCreation: Date;
  dateModification: Date;
  statut: "actif" | "inactif";
}

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<"grandes" | "petites">("grandes");
  const [grandesCategories, setGrandesCategories] = useState<GrandeCategorie[]>(
    []
  );
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [axes, setAxes] = useState<Axe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form data for grande categorie
  const [grandeFormData, setGrandeFormData] = useState<{
    nom: string;
    description: string;
    axe: string;
    ordre: number;
    statut: "actif" | "inactif";
  }>({
    nom: "",
    description: "",
    axe: "",
    ordre: 1,
    statut: "actif",
  });

  // Form data for categorie
  const [categorieFormData, setCategorieFormData] = useState<{
    nom: string;
    description: string;
    grandeCategorie: string;
    ordre: number;
    statut: "actif" | "inactif";
  }>({
    nom: "",
    description: "",
    grandeCategorie: "",
    ordre: 1,
    statut: "actif",
  });

  const [editingGrande, setEditingGrande] = useState<GrandeCategorie | null>(
    null
  );
  const [editingCategorie, setEditingCategorie] = useState<Categorie | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch axes
      const axesRes = await fetch("/api/axes");
      const axesData = await axesRes.json();
      if (axesData.success) setAxes(axesData.data);

      // Fetch categories
      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();
      if (categoriesData.success) {
        setGrandesCategories(categoriesData.data.grandesCategories || []);
        setCategories(categoriesData.data.categories || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrande = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingGrande ? "PATCH" : "POST";
      const url = editingGrande
        ? `/api/categories/${editingGrande._id}`
        : "/api/categories";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...grandeFormData, type: "grande" }),
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

  const handleSubmitCategorie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCategorie ? "PATCH" : "POST";
      const url = editingCategorie
        ? `/api/categories/${editingCategorie._id}`
        : "/api/categories";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...categorieFormData, type: "categorie" }),
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

  const handleEditGrande = (item: GrandeCategorie) => {
    setEditingGrande(item);
    setGrandeFormData({
      nom: item.nom,
      description: item.description,
      axe: typeof item.axe === "object" ? item.axe._id : item.axe,
      ordre: item.ordre,
      statut: item.statut,
    });
    setActiveTab("grandes");
    setShowModal(true);
  };

  const handleEditCategorie = (item: Categorie) => {
    setEditingCategorie(item);
    setCategorieFormData({
      nom: item.nom,
      description: item.description,
      grandeCategorie:
        typeof item.grandeCategorie === "object"
          ? item.grandeCategorie._id
          : item.grandeCategorie,
      ordre: item.ordre,
      statut: item.statut,
    });
    setActiveTab("petites");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
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
    setGrandeFormData({
      nom: "",
      description: "",
      axe: "",
      ordre: 1,
      statut: "actif",
    });
    setCategorieFormData({
      nom: "",
      description: "",
      grandeCategorie: "",
      ordre: 1,
      statut: "actif",
    });
    setEditingGrande(null);
    setEditingCategorie(null);
    setShowModal(false);
  };

  const filteredGrandes = grandesCategories.filter((item) =>
    item.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((item) =>
    item.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/dashboard/referentiel"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au référentiel
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des Catégories
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gérez les grandes catégories et catégories du système
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("grandes")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "grandes"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Grandes Catégories ({grandesCategories.length})
        </button>
        <button
          onClick={() => setActiveTab("petites")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "petites"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Catégories ({categories.length})
        </button>
      </div>

      {/* Search & Add */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {/* Table - Grandes Catégories */}
      {activeTab === "grandes" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Axe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Ordre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredGrandes.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.nom}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{
                        backgroundColor:
                          typeof item.axe === "object"
                            ? item.axe.couleur
                            : "#666",
                      }}
                    >
                      {typeof item.axe === "object" ? item.axe.nom : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {item.ordre}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        item.statut === "actif"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditGrande(item)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table - Catégories */}
      {activeTab === "petites" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Grande Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Ordre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.nom}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {typeof item.grandeCategorie === "object"
                      ? item.grandeCategorie.nom
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {item.ordre}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        item.statut === "actif"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditCategorie(item)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {activeTab === "grandes"
                ? editingGrande
                  ? "Modifier Grande Catégorie"
                  : "Nouvelle Grande Catégorie"
                : editingCategorie
                ? "Modifier Catégorie"
                : "Nouvelle Catégorie"}
            </h2>

            {activeTab === "grandes" ? (
              <form onSubmit={handleSubmitGrande} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={grandeFormData.nom}
                    onChange={(e) =>
                      setGrandeFormData({
                        ...grandeFormData,
                        nom: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={grandeFormData.description}
                    onChange={(e) =>
                      setGrandeFormData({
                        ...grandeFormData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Axe *
                  </label>
                  <select
                    required
                    value={grandeFormData.axe}
                    onChange={(e) =>
                      setGrandeFormData({
                        ...grandeFormData,
                        axe: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionner un axe</option>
                    {axes.map((axe) => (
                      <option key={axe._id} value={axe._id}>
                        {axe.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Ordre
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={grandeFormData.ordre}
                      onChange={(e) =>
                        setGrandeFormData({
                          ...grandeFormData,
                          ordre: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Statut
                    </label>
                    <select
                      value={grandeFormData.statut}
                      onChange={(e) =>
                        setGrandeFormData({
                          ...grandeFormData,
                          statut: e.target.value as "actif" | "inactif",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    {editingGrande ? "Modifier" : "Créer"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitCategorie} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={categorieFormData.nom}
                    onChange={(e) =>
                      setCategorieFormData({
                        ...categorieFormData,
                        nom: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={categorieFormData.description}
                    onChange={(e) =>
                      setCategorieFormData({
                        ...categorieFormData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Grande Catégorie *
                  </label>
                  <select
                    required
                    value={categorieFormData.grandeCategorie}
                    onChange={(e) =>
                      setCategorieFormData({
                        ...categorieFormData,
                        grandeCategorie: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionner une grande catégorie</option>
                    {grandesCategories.map((gc) => (
                      <option key={gc._id} value={gc._id}>
                        {gc.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Ordre
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={categorieFormData.ordre}
                      onChange={(e) =>
                        setCategorieFormData({
                          ...categorieFormData,
                          ordre: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Statut
                    </label>
                    <select
                      value={categorieFormData.statut}
                      onChange={(e) =>
                        setCategorieFormData({
                          ...categorieFormData,
                          statut: e.target.value as "actif" | "inactif",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    {editingCategorie ? "Modifier" : "Créer"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
