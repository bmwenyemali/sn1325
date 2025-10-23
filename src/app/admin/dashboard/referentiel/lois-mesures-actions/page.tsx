"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";
import { useLoisMesuresActions } from "@/hooks/useLoisMesuresActions";

interface TypeLMA {
  _id: string;
  nom: string;
}

interface LMMA {
  _id: string;
  nom: string;
  type: TypeLMA | string;
  description?: string;
  annee?: number;
  reference?: string;
  lien?: string;
  statut?: string;
}

export default function LoisMesuresActionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLMMA, setEditingLMMA] = useState<LMMA | null>(null);
  const [types, setTypes] = useState<TypeLMA[]>([]);

  const { loisMesuresActions, isLoading, mutate } = useLoisMesuresActions();

  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    description: "",
    annee: new Date().getFullYear(),
    reference: "",
    lien: "",
    statut: "en vigueur" as string,
  });

  // Fetch types on mount
  useEffect(() => {
    fetch("/api/type-lma")
      .then((res) => res.json())
      .then((data) => setTypes(data))
      .catch((err) => console.error("Error fetching types:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingLMMA
        ? `/api/lois-mesures-actions/${editingLMMA._id}`
        : "/api/lois-mesures-actions";
      const method = editingLMMA ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingLMMA(null);
        setFormData({
          nom: "",
          type: "",
          description: "",
          annee: new Date().getFullYear(),
          reference: "",
          lien: "",
          statut: "en vigueur",
        });
        mutate();
        alert(
          editingLMMA
            ? "Loi/Mesure/Action modifiée avec succès !"
            : "Loi/Mesure/Action créée avec succès !"
        );
      } else {
        const errorData = await res.json();
        alert(`Erreur: ${errorData.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error("Error saving LMMA:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (lmma: LMMA) => {
    setEditingLMMA(lmma);
    setFormData({
      nom: lmma.nom,
      type: typeof lmma.type === "object" ? lmma.type._id : lmma.type,
      description: lmma.description || "",
      annee: lmma.annee || new Date().getFullYear(),
      reference: lmma.reference || "",
      lien: lmma.lien || "",
      statut: lmma.statut || "en vigueur",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette LMMA ?")) return;

    try {
      const res = await fetch(`/api/lois-mesures-actions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        mutate();
        alert("Loi/Mesure/Action supprimée avec succès !");
      } else {
        const errorData = await res.json();
        alert(`Erreur: ${errorData.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error("Error deleting LMMA:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const filteredLMMAs = (loisMesuresActions || []).filter((lmma: LMMA) => {
    const matchesSearch =
      !searchTerm || lmma.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const typeId = typeof lmma.type === "object" ? lmma.type._id : lmma.type;
    const matchesType = !filterType || typeId === filterType;
    const matchesStatut = !filterStatut || lmma.statut === filterStatut;

    return matchesSearch && matchesType && matchesStatut;
  });

  if (isLoading) {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Lois, Mesures & Actions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérer les Lois, Mesures et Actions liées à la Résolution 1325
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLMMA(null);
            setFormData({
              nom: "",
              type: "",
              description: "",
              annee: new Date().getFullYear(),
              reference: "",
              lien: "",
              statut: "en vigueur",
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-bleu-rdc to-blue-600 hover:from-bleu-rdc/90 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Nouvelle LMMA
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          >
            <option value="">Tous les types</option>
            {types.map((type) => (
              <option key={type._id} value={type._id}>
                {type.nom}
              </option>
            ))}
          </select>

          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="en vigueur">En vigueur</option>
            <option value="abrogé">Abrogé</option>
            <option value="en projet">En projet</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {loisMesuresActions?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">En vigueur</p>
          <p className="text-2xl font-bold text-green-600">
            {loisMesuresActions?.filter((l: LMMA) => l.statut === "en vigueur")
              .length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">En projet</p>
          <p className="text-2xl font-bold text-blue-600">
            {loisMesuresActions?.filter((l: LMMA) => l.statut === "en projet")
              .length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Abrogés</p>
          <p className="text-2xl font-bold text-red-600">
            {loisMesuresActions?.filter((l: LMMA) => l.statut === "abrogé")
              .length || 0}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Année
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredLMMAs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune Loi/Mesure/Action trouvée
                  </td>
                </tr>
              ) : (
                filteredLMMAs.map((lmma: LMMA) => (
                  <tr
                    key={lmma._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {lmma.nom}
                          </p>
                          {lmma.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {lmma.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {typeof lmma.type === "object"
                          ? lmma.type.nom
                          : lmma.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {lmma.annee || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lmma.statut === "en vigueur"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : lmma.statut === "abrogé"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : lmma.statut === "en projet"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {lmma.statut || "Non spécifié"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {lmma.reference || "-"}
                        </span>
                        {lmma.lien && (
                          <a
                            href={lmma.lien}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-bleu-rdc hover:text-bleu-rdc/80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(lmma)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lmma._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingLMMA ? "Modifier" : "Nouvelle"} Loi/Mesure/Action
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Loi n°15/013 du 1er août 2015..."
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Sélectionner un type</option>
                  {types.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Description de la loi/mesure/action..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Année
                  </label>
                  <input
                    type="number"
                    min="1960"
                    max="2100"
                    value={formData.annee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        annee: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) =>
                      setFormData({ ...formData, statut: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="en vigueur">En vigueur</option>
                    <option value="abrogé">Abrogé</option>
                    <option value="en projet">En projet</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Référence
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Ex: JO n°..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lien (URL)
                </label>
                <input
                  type="url"
                  value={formData.lien}
                  onChange={(e) =>
                    setFormData({ ...formData, lien: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLMMA(null);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-bleu-rdc hover:bg-bleu-rdc/90 text-white rounded-lg transition-colors"
                >
                  {editingLMMA ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
