"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, X, ListChecks, Eye } from "lucide-react";
import { useDataQualitative, useIndicateurs, useAnnees } from "@/hooks/useApi";
import { useLoisMesuresActions } from "@/hooks/useLoisMesuresActions";

export default function DataQualitativeTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [lmmaSearchTerm, setLmmaSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingData, setEditingData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedData, setSelectedData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any>(null);
  const [currentIndicatorId, setCurrentIndicatorId] = useState<string>("");
  const [selectedLMMAs, setSelectedLMMAs] = useState<string[]>([]);

  const { data: qualitativeData, loading, error } = useDataQualitative();
  const { data: indicateurs } = useIndicateurs();
  const { data: annees } = useAnnees();
  const { loisMesuresActions } = useLoisMesuresActions();

  // Debug logging
  console.log("DataQualitativeTab - Loading:", loading);
  console.log("DataQualitativeTab - Error:", error);
  console.log("DataQualitativeTab - Data:", qualitativeData);
  console.log("DataQualitativeTab - LMMA:", loisMesuresActions);

  // Filter data
  const filteredData = (qualitativeData || []).filter(
    (item) =>
      !searchTerm ||
      item.indicateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indicateur?.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      indicateur: formData.get("indicateur"),
      description: formData.get("description") || "",
      source: formData.get("source") || "",
      items: [],
    };

    try {
      const url = editingData
        ? `/api/data-liste/${editingData._id}`
        : "/api/data-liste";
      const method = editingData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingData(null);
        alert(
          editingData
            ? "Indicateur modifié avec succès !"
            : "Indicateur créé avec succès ! Vous pouvez maintenant ajouter des items LMMA en cliquant sur le bouton vert '+'."
        );
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(
          `Erreur lors de l'enregistrement: ${
            errorData.error || "Une erreur est survenue"
          }\n\nVeuillez vérifier que tous les champs requis sont correctement remplis.`
        );
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert(
        "Erreur de connexion lors de l'enregistrement.\n\nVeuillez vérifier votre connexion internet et réessayer."
      );
    }
  };

  const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Get selected LMMA IDs from checkboxes
    const selectedLMMAIds = Array.from(
      formData.getAll("loisMesuresActions")
    ) as string[];

    if (selectedLMMAIds.length === 0) {
      alert("Veuillez sélectionner au moins une Loi/Mesure/Action");
      return;
    }

    const annee = parseInt(formData.get("annee") as string);
    const ordre = formData.get("ordre")
      ? parseInt(formData.get("ordre") as string)
      : undefined;
    const notes = (formData.get("notes") as string) || "";

    // Create multiple items, one for each selected LMMA
    const items = selectedLMMAIds.map((lmmaId, index) => ({
      loisMesuresActions: lmmaId,
      annee: annee,
      ordre: ordre ? ordre + index : index + 1,
      notes: notes,
    }));

    try {
      // Add all selected LMMA as separate items
      for (const itemData of items) {
        const res = await fetch(`/api/data-liste/${currentIndicatorId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(
            `Erreur lors de l'ajout d'un item: ${
              errorData.error || "Une erreur est survenue"
            }`
          );
          return;
        }
      }

      setIsItemModalOpen(false);
      setEditingItem(null);
      setCurrentIndicatorId("");
      setSelectedLMMAs([]);
      alert(`${selectedLMMAIds.length} item(s) LMMA ajouté(s) avec succès !`);
      window.location.reload();
    } catch (error) {
      console.error("Error saving items:", error);
      alert(
        "Erreur de connexion lors de l'enregistrement.\n\nVeuillez vérifier votre connexion internet et réessayer."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cet indicateur et tous ses items ?"
      )
    )
      return;

    try {
      const res = await fetch(`/api/data-liste/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleDeleteItem = async (indicatorId: string, itemId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet item ?")) return;

    try {
      const res = await fetch(
        `/api/data-liste/${indicatorId}/items/${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const openAddItemModal = (indicatorId: string) => {
    setCurrentIndicatorId(indicatorId);
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (indicatorId: string, item: unknown) => {
    setCurrentIndicatorId(indicatorId);
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bleu-rdc"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par indicateur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-bleu-rdc to-blue-600 hover:from-bleu-rdc/90 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvel Indicateur Qualitatif</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {qualitativeData?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Indicateurs Qualitatifs
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredData.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Résultats Filtrés
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {qualitativeData?.reduce(
              (sum, item) => sum + (item.items?.length || 0),
              0
            ) || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total LMMA
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredData.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-bleu-rdc/10 dark:bg-jaune-rdc/10 p-2 rounded-lg">
                    <ListChecks className="w-6 h-6 text-bleu-rdc dark:text-jaune-rdc" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.indicateur.nom}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Code: {item.indicateur.code}
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openAddItemModal(item._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                  title="Ajouter un item LMMA (Loi, Mesure ou Action)"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Ajouter LMMA</span>
                  {item.items && item.items.length > 0 && (
                    <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {item.items.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingData(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Modifier l'indicateur"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedData(item);
                    setIsDetailModalOpen(true);
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  title="Voir détails"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items List */}
            {item.items && item.items.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Lois, Mesures & Actions ({item.items.length})
                </h4>
                <div className="space-y-2">
                  {item.items.slice(0, 3).map(
                    (
                      lmma: {
                        loisMesuresActions:
                          | {
                              _id: string;
                              nom?: string;
                              titre?: string;
                              type: { nom: string } | string;
                            }
                          | string;
                        annee: number;
                        _id?: string;
                      },
                      idx: number
                    ) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {typeof lmma.loisMesuresActions === "object"
                              ? lmma.loisMesuresActions.nom ||
                                lmma.loisMesuresActions.titre ||
                                "N/A"
                              : "N/A"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {typeof lmma.loisMesuresActions === "object" &&
                            typeof lmma.loisMesuresActions.type === "object"
                              ? lmma.loisMesuresActions.type.nom
                              : typeof lmma.loisMesuresActions === "object" &&
                                typeof lmma.loisMesuresActions.type === "string"
                              ? lmma.loisMesuresActions.type
                              : "N/A"}{" "}
                            - {lmma.annee}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditItemModal(item._id, lmma)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            title="Modifier"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem(item._id, lmma._id || "")
                            }
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  {item.items.length > 3 && (
                    <button
                      onClick={() => {
                        setSelectedData(item);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-sm text-bleu-rdc hover:underline"
                    >
                      Voir tous les {item.items.length} items
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucune donnée qualitative trouvée
          </div>
        )}
      </div>

      {/* Modal for Indicator CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingData
                  ? "Modifier l'Indicateur Qualitatif"
                  : "Nouvel Indicateur Qualitatif"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingData(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Indicateur Qualitatif *
                </label>
                <select
                  name="indicateur"
                  required
                  defaultValue={editingData?.indicateur._id}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">
                    Sélectionner un indicateur qualitatif
                  </option>
                  {indicateurs
                    ?.filter((ind) => ind.type === "qualitatif")
                    .map((ind) => (
                      <option key={ind._id} value={ind._id}>
                        {ind.code} - {ind.nom}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Seuls les indicateurs de type qualitatif sont affichés
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingData?.description}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Description de l'indicateur..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  name="source"
                  defaultValue={editingData?.source}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Source des données..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingData(null);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-bleu-rdc to-blue-600 hover:from-bleu-rdc/90 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {editingData ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Item LMMA Selection */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sélectionner des Lois/Mesures/Actions
              </h2>
              <button
                onClick={() => {
                  setIsItemModalOpen(false);
                  setEditingItem(null);
                  setCurrentIndicatorId("");
                  setSelectedLMMAs([]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="p-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Instructions:</strong> Sélectionnez une ou plusieurs
                  Lois/Mesures/Actions existantes de la collection à associer à
                  cet indicateur. Vous pouvez sélectionner plusieurs items en
                  cochant les cases.
                </p>
              </div>

              {/* LMMA Selection List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Lois, Mesures & Actions disponibles *
                </label>

                {/* Search field for LMMA */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher une loi, mesure ou action..."
                    value={lmmaSearchTerm}
                    onChange={(e) => setLmmaSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="border border-gray-300 dark:border-slate-600 rounded-lg max-h-96 overflow-y-auto">
                  {!loisMesuresActions || loisMesuresActions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Aucune loi/mesure/action disponible. Veuillez d&apos;abord
                      en créer dans la section Référentiel.
                    </div>
                  ) : (
                    loisMesuresActions
                      .filter(
                        (lmma: {
                          nom: string;
                          type: { nom: string };
                          reference?: string;
                        }) =>
                          !lmmaSearchTerm ||
                          lmma.nom
                            ?.toLowerCase()
                            .includes(lmmaSearchTerm.toLowerCase()) ||
                          lmma.type?.nom
                            ?.toLowerCase()
                            .includes(lmmaSearchTerm.toLowerCase()) ||
                          lmma.reference
                            ?.toLowerCase()
                            .includes(lmmaSearchTerm.toLowerCase())
                      )
                      .map(
                        (lmma: {
                          _id: string;
                          nom: string;
                          type: { nom: string };
                          annee?: number;
                          reference?: string;
                          statut?: string;
                        }) => (
                          <label
                            key={lmma._id}
                            className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-gray-200 dark:border-slate-700 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              name="loisMesuresActions"
                              value={lmma._id}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLMMAs((prev) => [
                                    ...prev,
                                    lmma._id,
                                  ]);
                                } else {
                                  setSelectedLMMAs((prev) =>
                                    prev.filter((id) => id !== lmma._id)
                                  );
                                }
                              }}
                              className="mt-1 w-5 h-5 text-bleu-rdc focus:ring-bleu-rdc border-gray-300 rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {lmma.nom}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  {lmma.type.nom}
                                </span>
                                {lmma.annee && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {lmma.annee}
                                  </span>
                                )}
                                {lmma.statut && (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      lmma.statut === "en vigueur"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {lmma.statut}
                                  </span>
                                )}
                              </div>
                              {lmma.reference && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  Réf: {lmma.reference}
                                </p>
                              )}
                            </div>
                          </label>
                        )
                      )
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {selectedLMMAs.length} item(s) sélectionné(s)
                </p>
              </div>

              {/* Common fields for all selected items */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Année *
                  </label>
                  <select
                    name="annee"
                    required
                    defaultValue={editingItem?.annee}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionner</option>
                    {annees?.map((a) => (
                      <option key={a._id} value={a.annee}>
                        {a.annee}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ordre de départ
                  </label>
                  <input
                    type="number"
                    name="ordre"
                    defaultValue={1}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 1, 2, 3..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Les items suivants seront incrémentés automatiquement
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (communes à tous les items sélectionnés)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingItem?.notes}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Notes additionnelles..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsItemModalOpen(false);
                    setEditingItem(null);
                    setCurrentIndicatorId("");
                    setSelectedLMMAs([]);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={selectedLMMAs.length === 0}
                  className="px-6 py-2 bg-bleu-rdc hover:bg-bleu-rdc/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter ({selectedLMMAs.length})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Détails - {selectedData.indicateur.nom}
              </h2>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedData(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  CODE
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedData.indicateur.code}
                </p>
              </div>

              {selectedData.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    DESCRIPTION
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedData.description}
                  </p>
                </div>
              )}

              {selectedData.source && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    SOURCE
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedData.source}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  LOIS, MESURES & ACTIONS ({selectedData.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedData.items?.map(
                    (
                      lmma: {
                        loisMesuresActions:
                          | {
                              nom?: string;
                              titre?: string;
                              type: { nom: string } | string;
                            }
                          | string;
                        annee: number;
                        ordre?: number;
                        notes?: string;
                      },
                      idx: number
                    ) => {
                      const lmmaObj =
                        typeof lmma.loisMesuresActions === "object"
                          ? lmma.loisMesuresActions
                          : null;
                      const lmmaNom = lmmaObj?.nom || lmmaObj?.titre || "N/A";
                      const typeName =
                        typeof lmmaObj?.type === "object"
                          ? lmmaObj.type.nom
                          : lmmaObj?.type || "N/A";

                      return (
                        <div
                          key={idx}
                          className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {lmma.ordre ? `${lmma.ordre}. ` : ""}
                                {lmmaNom}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className="font-medium">{typeName}</span>{" "}
                                - {lmma.annee}
                              </p>
                              {lmma.notes && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  {lmma.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                  {(!selectedData.items || selectedData.items.length === 0) && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Aucun item LMMA
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
