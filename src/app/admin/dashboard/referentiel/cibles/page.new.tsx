"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  FolderTree,
  Grid3x3,
  Crosshair,
  X,
} from "lucide-react";

// Types
interface GrandeCategorie {
  _id: string;
  nom: string;
  description?: string;
  ordre?: number;
}

interface Categorie {
  _id: string;
  nom: string;
  description?: string;
  grandeCategorie: GrandeCategorie | string;
  ordre?: number;
}

interface Cible {
  _id: string;
  nom: string;
  description?: string;
  categorie: Categorie | string;
  grandeCategorie: GrandeCategorie | string;
  ordre: number;
}

type TabType = "grandes-categories" | "categories" | "cibles";

export default function CiblesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("grandes-categories");
  const [grandesCategories, setGrandesCategories] = useState<GrandeCategorie[]>(
    []
  );
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [cibles, setCibles] = useState<Cible[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingGrandeCategorie, setEditingGrandeCategorie] =
    useState<GrandeCategorie | null>(null);
  const [editingCategorie, setEditingCategorie] = useState<Categorie | null>(
    null
  );
  const [editingCible, setEditingCible] = useState<Cible | null>(null);

  // Form data
  const [grandeCategorieForm, setGrandeCategorieForm] = useState({
    nom: "",
    description: "",
    ordre: 0,
  });

  const [categorieForm, setCategorieForm] = useState({
    nom: "",
    description: "",
    grandeCategorie: "",
    ordre: 0,
  });

  const [cibleForm, setCibleForm] = useState({
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
      const [grandesRes, categoriesRes, ciblesRes] = await Promise.all([
        fetch("/api/grandes-categories"),
        fetch("/api/categories"),
        fetch("/api/cibles"),
      ]);

      const grandesData = await grandesRes.json();
      const categoriesData = await categoriesRes.json();
      const ciblesData = await ciblesRes.json();

      if (Array.isArray(grandesData)) {
        setGrandesCategories(grandesData);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data.categories || []);
      }

      if (ciblesData.success) {
        setCibles(ciblesData.data || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Count categories per grande categorie
  const categoriesCountByGrande = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      const gcId =
        typeof cat.grandeCategorie === "object"
          ? cat.grandeCategorie._id
          : cat.grandeCategorie;
      counts[gcId] = (counts[gcId] || 0) + 1;
    });
    return counts;
  }, [categories]);

  // Count cibles per categorie
  const ciblesCountByCategorie = useMemo(() => {
    const counts: Record<string, number> = {};
    cibles.forEach((cible) => {
      const catId =
        typeof cible.categorie === "object"
          ? cible.categorie._id
          : cible.categorie;
      counts[catId] = (counts[catId] || 0) + 1;
    });
    return counts;
  }, [cibles]);

  // Handlers for Grandes Categories
  const handleGrandeCategorieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingGrandeCategorie
        ? `/api/grandes-categories/${editingGrandeCategorie._id}`
        : "/api/grandes-categories";
      const method = editingGrandeCategorie ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grandeCategorieForm),
      });

      if (response.ok) {
        await fetchData();
        resetGrandeCategorieForm();
      } else {
        alert("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleGrandeCategorieEdit = (gc: GrandeCategorie) => {
    setEditingGrandeCategorie(gc);
    setGrandeCategorieForm({
      nom: gc.nom,
      description: gc.description || "",
      ordre: gc.ordre || 0,
    });
    setShowModal(true);
  };

  const handleGrandeCategorieDelete = async (id: string) => {
    const count = categoriesCountByGrande[id] || 0;
    if (count > 0) {
      alert(
        `Impossible de supprimer cette grande catégorie car elle contient ${count} catégorie(s).`
      );
      return;
    }

    if (
      confirm("Êtes-vous sûr de vouloir supprimer cette grande catégorie ?")
    ) {
      try {
        const response = await fetch(`/api/grandes-categories/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchData();
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const resetGrandeCategorieForm = () => {
    setGrandeCategorieForm({ nom: "", description: "", ordre: 0 });
    setEditingGrandeCategorie(null);
    setShowModal(false);
  };

  // Handlers for Categories
  const handleCategorieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategorie
        ? `/api/categories/${editingCategorie._id}`
        : "/api/categories";
      const method = editingCategorie ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categorieForm),
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        resetCategorieForm();
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleCategorieEdit = (cat: Categorie) => {
    setEditingCategorie(cat);
    setCategorieForm({
      nom: cat.nom,
      description: cat.description || "",
      grandeCategorie:
        typeof cat.grandeCategorie === "object"
          ? cat.grandeCategorie._id
          : cat.grandeCategorie,
      ordre: cat.ordre || 0,
    });
    setShowModal(true);
  };

  const handleCategorieDelete = async (id: string) => {
    const count = ciblesCountByCategorie[id] || 0;
    if (count > 0) {
      alert(
        `Impossible de supprimer cette catégorie car elle contient ${count} cible(s).`
      );
      return;
    }

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

  const resetCategorieForm = () => {
    setCategorieForm({
      nom: "",
      description: "",
      grandeCategorie: "",
      ordre: 0,
    });
    setEditingCategorie(null);
    setShowModal(false);
  };

  // Handlers for Cibles
  const handleCibleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCible ? "PATCH" : "POST";
      const url = editingCible
        ? `/api/cibles/${editingCible._id}`
        : "/api/cibles";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cibleForm),
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        resetCibleForm();
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleCibleEdit = (cible: Cible) => {
    setEditingCible(cible);
    setCibleForm({
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

  const handleCibleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette cible ?")) {
      try {
        const response = await fetch(`/api/cibles/${id}`, { method: "DELETE" });
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

  const resetCibleForm = () => {
    setCibleForm({
      nom: "",
      description: "",
      categorie: "",
      grandeCategorie: "",
      ordre: 1,
    });
    setEditingCible(null);
    setShowModal(false);
  };

  // Filtered data based on search
  const filteredGrandesCategories = grandesCategories.filter((gc) =>
    gc.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((cat) =>
    cat.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCibles = cibles.filter((cible) =>
    cible.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewClick = () => {
    if (activeTab === "grandes-categories") {
      resetGrandeCategorieForm();
    } else if (activeTab === "categories") {
      resetCategorieForm();
    } else {
      resetCibleForm();
    }
    setShowModal(true);
  };

  const getModalTitle = () => {
    if (activeTab === "grandes-categories") {
      return editingGrandeCategorie
        ? "Modifier la Grande Catégorie"
        : "Nouvelle Grande Catégorie";
    } else if (activeTab === "categories") {
      return editingCategorie ? "Modifier la Catégorie" : "Nouvelle Catégorie";
    } else {
      return editingCible ? "Modifier la Cible" : "Nouvelle Cible";
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Cibles
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez les grandes catégories, catégories et cibles
          </p>
        </div>
        <button
          onClick={handleNewClick}
          className="flex items-center gap-2 px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {activeTab === "grandes-categories" && "Nouvelle Grande Catégorie"}
          {activeTab === "categories" && "Nouvelle Catégorie"}
          {activeTab === "cibles" && "Nouvelle Cible"}
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 px-4" aria-label="Tabs">
            <button
              onClick={() => {
                setActiveTab("grandes-categories");
                setSearchTerm("");
              }}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                ${
                  activeTab === "grandes-categories"
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }
              `}
            >
              <FolderTree className="w-5 h-5" />
              Grandes Catégories
            </button>
            <button
              onClick={() => {
                setActiveTab("categories");
                setSearchTerm("");
              }}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                ${
                  activeTab === "categories"
                    ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }
              `}
            >
              <Grid3x3 className="w-5 h-5" />
              Catégories
            </button>
            <button
              onClick={() => {
                setActiveTab("cibles");
                setSearchTerm("");
              }}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                ${
                  activeTab === "cibles"
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }
              `}
            >
              <Crosshair className="w-5 h-5" />
              Cibles
            </button>
          </nav>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Rechercher ${
                activeTab === "grandes-categories"
                  ? "une grande catégorie"
                  : activeTab === "categories"
                  ? "une catégorie"
                  : "une cible"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Content based on active tab */}
          {activeTab === "grandes-categories" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nb Catégories
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredGrandesCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Aucune grande catégorie trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredGrandesCategories.map((gc) => (
                      <tr
                        key={gc._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {gc.ordre || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {gc.nom}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {gc.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {categoriesCountByGrande[gc._id] || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleGrandeCategorieEdit(gc)}
                            className="text-bleu-rdc hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleGrandeCategorieDelete(gc._id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Grande Catégorie
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nb Cibles
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Aucune catégorie trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => (
                      <tr
                        key={cat._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {cat.ordre || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {cat.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {typeof cat.grandeCategorie === "object"
                            ? cat.grandeCategorie.nom
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {ciblesCountByCategorie[cat._id] || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleCategorieEdit(cat)}
                            className="text-bleu-rdc hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleCategorieDelete(cat._id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "cibles" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Grande Catégorie
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCibles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Aucune cible trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredCibles.map((cible) => (
                      <tr
                        key={cible._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {cible.ordre}
                        </td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleCibleEdit(cible)}
                            className="text-bleu-rdc hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleCibleDelete(cible._id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getModalTitle()}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetGrandeCategorieForm();
                  resetCategorieForm();
                  resetCibleForm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Grande Categorie Form */}
              {activeTab === "grandes-categories" && (
                <form
                  onSubmit={handleGrandeCategorieSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={grandeCategorieForm.nom}
                      onChange={(e) =>
                        setGrandeCategorieForm({
                          ...grandeCategorieForm,
                          nom: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={grandeCategorieForm.description}
                      onChange={(e) =>
                        setGrandeCategorieForm({
                          ...grandeCategorieForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ordre
                    </label>
                    <input
                      type="number"
                      value={grandeCategorieForm.ordre}
                      onChange={(e) =>
                        setGrandeCategorieForm({
                          ...grandeCategorieForm,
                          ordre: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetGrandeCategorieForm}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingGrandeCategorie ? "Mettre à jour" : "Créer"}
                    </button>
                  </div>
                </form>
              )}

              {/* Categorie Form */}
              {activeTab === "categories" && (
                <form onSubmit={handleCategorieSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={categorieForm.nom}
                      onChange={(e) =>
                        setCategorieForm({
                          ...categorieForm,
                          nom: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={categorieForm.description}
                      onChange={(e) =>
                        setCategorieForm({
                          ...categorieForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grande Catégorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={categorieForm.grandeCategorie}
                      onChange={(e) =>
                        setCategorieForm({
                          ...categorieForm,
                          grandeCategorie: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">
                        Sélectionner une grande catégorie
                      </option>
                      {grandesCategories.map((gc) => (
                        <option key={gc._id} value={gc._id}>
                          {gc.nom}
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
                      value={categorieForm.ordre}
                      onChange={(e) =>
                        setCategorieForm({
                          ...categorieForm,
                          ordre: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetCategorieForm}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingCategorie ? "Mettre à jour" : "Créer"}
                    </button>
                  </div>
                </form>
              )}

              {/* Cible Form */}
              {activeTab === "cibles" && (
                <form onSubmit={handleCibleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cibleForm.nom}
                      onChange={(e) =>
                        setCibleForm({ ...cibleForm, nom: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={cibleForm.description}
                      onChange={(e) =>
                        setCibleForm({
                          ...cibleForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grande Catégorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={cibleForm.grandeCategorie}
                      onChange={(e) =>
                        setCibleForm({
                          ...cibleForm,
                          grandeCategorie: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">
                        Sélectionner une grande catégorie
                      </option>
                      {grandesCategories.map((gc) => (
                        <option key={gc._id} value={gc._id}>
                          {gc.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={cibleForm.categorie}
                      onChange={(e) =>
                        setCibleForm({
                          ...cibleForm,
                          categorie: e.target.value,
                        })
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
                      value={cibleForm.ordre}
                      onChange={(e) =>
                        setCibleForm({
                          ...cibleForm,
                          ordre: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetCibleForm}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-bleu-rdc text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingCible ? "Mettre à jour" : "Créer"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
