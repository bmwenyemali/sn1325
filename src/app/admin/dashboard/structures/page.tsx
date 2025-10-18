"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Building2 } from "lucide-react";

interface Province {
  _id: string;
  nom: string;
}

interface Structure {
  _id: string;
  nom: string;
  type: string;
  sigle?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  responsable?: string;
  province?: Province | string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function StructuresPage() {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStructure, setEditingStructure] = useState<Structure | null>(
    null
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    sigle: "",
    adresse: "",
    telephone: "",
    email: "",
    responsable: "",
    province: "",
    description: "",
  });

  const types = [
    "Ministère",
    "Institution",
    "ONG",
    "Organisation Internationale",
    "Agence",
    "Commission",
    "Autre",
  ];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const fetchData = async () => {
    try {
      const queryParams = typeFilter !== "all" ? `?type=${typeFilter}` : "";
      const [structuresRes, provincesRes] = await Promise.all([
        fetch(`/api/structures${queryParams}`),
        fetch("/api/provinces"),
      ]);

      const structuresData = await structuresRes.json();
      const provincesData = await provincesRes.json();

      if (structuresData.success) setStructures(structuresData.data);
      if (provincesData.success) setProvinces(provincesData.data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingStructure ? "PATCH" : "POST";
      const url = editingStructure
        ? `/api/structures/${editingStructure._id}`
        : "/api/structures";

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

  const handleEdit = (structure: Structure) => {
    setEditingStructure(structure);
    setFormData({
      nom: structure.nom,
      type: structure.type,
      sigle: structure.sigle || "",
      adresse: structure.adresse || "",
      telephone: structure.telephone || "",
      email: structure.email || "",
      responsable: structure.responsable || "",
      province:
        typeof structure.province === "object"
          ? structure.province._id
          : structure.province || "",
      description: structure.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette structure ?")) {
      try {
        const response = await fetch(`/api/structures/${id}`, {
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
      type: "",
      sigle: "",
      adresse: "",
      telephone: "",
      email: "",
      responsable: "",
      province: "",
      description: "",
    });
    setEditingStructure(null);
    setShowModal(false);
  };

  const filteredStructures = structures.filter(
    (structure) =>
      structure.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (structure.sigle &&
        structure.sigle.toLowerCase().includes(searchTerm.toLowerCase()))
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
          Gestion des Structures
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Structure</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une structure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-800 dark:text-white"
        >
          <option value="all">Tous les types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStructures.map((structure) => (
          <div
            key={structure._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-t-4 border-bleu-rdc"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-bleu-rdc bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                    <Building2 className="w-6 h-6 text-bleu-rdc" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {structure.sigle || structure.nom}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {structure.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {structure.nom}
                </p>
                {structure.responsable && (
                  <p className="flex items-center">
                    <span className="font-medium">Responsable:</span>
                    <span className="ml-2">{structure.responsable}</span>
                  </p>
                )}
                {structure.province &&
                  typeof structure.province === "object" && (
                    <p className="flex items-center">
                      <span className="font-medium">Province:</span>
                      <span className="ml-2">{structure.province.nom}</span>
                    </p>
                  )}
                {structure.telephone && (
                  <p className="flex items-center">
                    <span className="font-medium">Tel:</span>
                    <span className="ml-2">{structure.telephone}</span>
                  </p>
                )}
                {structure.email && (
                  <p className="flex items-center">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2 text-xs">{structure.email}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(structure)}
                  className="p-2 text-bleu-rdc hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(structure._id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStructures.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Aucune structure trouvée
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingStructure
                ? "Modifier la structure"
                : "Nouvelle structure"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet *
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
                    Sigle
                  </label>
                  <input
                    type="text"
                    value={formData.sigle}
                    onChange={(e) =>
                      setFormData({ ...formData, sigle: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner un type</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Responsable
                  </label>
                  <input
                    type="text"
                    value={formData.responsable}
                    onChange={(e) =>
                      setFormData({ ...formData, responsable: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner une province</option>
                    {provinces.map((province) => (
                      <option key={province._id} value={province._id}>
                        {province.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={(e) =>
                      setFormData({ ...formData, adresse: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
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
                  {editingStructure ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
