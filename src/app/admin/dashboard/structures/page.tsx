"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Building2, X } from "lucide-react";
import { StructuresTable } from "@/components/StructuresTable";
import { useStructures, useAxes, useProvinces } from "@/hooks/useApi";

interface Structure {
  _id: string;
  nom: string;
  sigle?: string;
  type?: string;
  email?: string;
  telephone?: string;
  emailPrive?: string;
  telephonePrive?: string;
  adresse?: string;
  pointFocal?: string;
  aPropos?: string;
  isNational?: boolean;
  provinces?: { _id: string; nom: string; code?: string }[];
  axes?: { _id: string; nom: string; numero: number }[];
  cible?: { _id: string; nom: string; numero?: number }[];
  latitude?: string;
  longitude?: string;
  gpsDescription?: string;
  photo?: string;
}

interface Cible {
  _id: string;
  nom: string;
  numero: number;
}

const STRUCTURE_TYPES = [
  "Org Internationale",
  "Org Publique",
  "Privée",
  "Société Civile",
  "Autres",
];

export default function AdminStructuresPage() {
  const { data: allStructures, loading: structuresLoading } = useStructures();
  const { data: axes } = useAxes();
  const { data: provinces } = useProvinces();

  const refreshStructures = () => {
    window.location.reload();
  };

  const [cibles, setCibles] = useState<Cible[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState<Structure | null>(
    null
  );

  const [formData, setFormData] = useState({
    nom: "",
    sigle: "",
    type: "",
    email: "",
    telephone: "",
    emailPrive: "",
    telephonePrive: "",
    adresse: "",
    pointFocal: "",
    aPropos: "",
    isNational: false,
    provinces: [] as string[],
    axes: [] as string[],
    cible: [] as string[],
    latitude: "",
    longitude: "",
    gpsDescription: "",
    photo: "",
  });

  // Fetch cibles
  useEffect(() => {
    const fetchCibles = async () => {
      try {
        const response = await fetch("/api/cibles");
        const data = await response.json();
        if (data.success) setCibles(data.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des cibles:", error);
      }
    };
    fetchCibles();
  }, []);

  // Filter structures
  const filteredStructures = (allStructures || []).filter((structure) => {
    const matchesSearch =
      !searchTerm ||
      structure.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.sigle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || structure.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleEdit = (structure: Structure) => {
    setEditingStructure(structure);
    setFormData({
      nom: structure.nom || "",
      sigle: structure.sigle || "",
      type: structure.type || "",
      email: structure.email || "",
      telephone: structure.telephone || "",
      emailPrive: structure.emailPrive || "",
      telephonePrive: structure.telephonePrive || "",
      adresse: structure.adresse || "",
      pointFocal: structure.pointFocal || "",
      aPropos: structure.aPropos || "",
      isNational: structure.isNational || false,
      provinces: structure.provinces?.map((p) => p._id) || [],
      axes: structure.axes?.map((a) => a._id) || [],
      cible: structure.cible?.map((c) => c._id) || [],
      latitude: structure.latitude || "",
      longitude: structure.longitude || "",
      gpsDescription: structure.gpsDescription || "",
      photo: structure.photo || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette structure ?"))
      return;

    try {
      const response = await fetch(`/api/structures/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        refreshStructures();
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
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
        setShowModal(false);
        resetForm();
        refreshStructures();
      } else {
        alert(result.error || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      sigle: "",
      type: "",
      email: "",
      telephone: "",
      emailPrive: "",
      telephonePrive: "",
      adresse: "",
      pointFocal: "",
      aPropos: "",
      isNational: false,
      provinces: [],
      axes: [],
      cible: [],
      latitude: "",
      longitude: "",
      gpsDescription: "",
      photo: "",
    });
    setEditingStructure(null);
  };

  const handleToggleSelection = (
    field: "provinces" | "axes" | "cible",
    id: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((item) => item !== id)
        : [...prev[field], id],
    }));
  };

  if (structuresLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7" />
            Gestion des Structures
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredStructures.length} structure(s)
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Structure
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou sigle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            {STRUCTURE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <StructuresTable
        structures={filteredStructures}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions={true}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingStructure ? "Modifier" : "Nouvelle"} Structure
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

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informations de base
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Sélectionner...</option>
                      {STRUCTURE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Photo (URL)
                    </label>
                    <input
                      type="url"
                      value={formData.photo}
                      onChange={(e) =>
                        setFormData({ ...formData, photo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Organization */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Organisation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Privé */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Point Focal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom Point Focal
                    </label>
                    <input
                      type="text"
                      value={formData.pointFocal}
                      onChange={(e) =>
                        setFormData({ ...formData, pointFocal: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Privé
                    </label>
                    <input
                      type="email"
                      value={formData.emailPrive}
                      onChange={(e) =>
                        setFormData({ ...formData, emailPrive: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone Privé
                    </label>
                    <input
                      type="tel"
                      value={formData.telephonePrive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          telephonePrive: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Localisation
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adresse
                    </label>
                    <textarea
                      value={formData.adresse}
                      onChange={(e) =>
                        setFormData({ ...formData, adresse: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isNational"
                      checked={formData.isNational}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isNational: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isNational"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Couverture Nationale
                    </label>
                  </div>

                  {!formData.isNational && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Provinces
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        {(provinces || []).map((province) => (
                          <label
                            key={province._id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={formData.provinces.includes(
                                province._id
                              )}
                              onChange={() =>
                                handleToggleSelection("provinces", province._id)
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {province.nom}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Relations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Relations
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Axes Stratégiques
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                      {(axes || []).map((axe) => (
                        <label
                          key={axe._id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={formData.axes.includes(axe._id)}
                            onChange={() =>
                              handleToggleSelection("axes", axe._id)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {axe.numero}. {axe.nom}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cibles
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                      {cibles.map((cible) => (
                        <label
                          key={cible._id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={formData.cible.includes(cible._id)}
                            onChange={() =>
                              handleToggleSelection("cible", cible._id)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {cible.numero}. {cible.nom}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* GPS */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Coordonnées GPS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                      placeholder="-4.3276"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                      placeholder="15.3136"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.gpsDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gpsDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  À propos
                </label>
                <textarea
                  value={formData.aPropos}
                  onChange={(e) =>
                    setFormData({ ...formData, aPropos: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
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
