"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, X, ListChecks, Eye } from "lucide-react";
import { useDataQualitative, useIndicateurs, useAnnees } from "@/hooks/useApi";

export default function DataQualitativeTab() {
  const [searchTerm, setSearchTerm] = useState("");
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

  const { data: qualitativeData, loading } = useDataQualitative();
  const { data: indicateurs } = useIndicateurs();
  const { data: annees } = useAnnees();

  // Filter data
  const filteredData = (qualitativeData || []).filter(
    (item) =>
      item.indicateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indicateur.code.toLowerCase().includes(searchTerm.toLowerCase())
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
      const method = editingData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingData(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const itemData = {
      lmaTitre: formData.get("lmaTitre"),
      lmaType: formData.get("lmaType"),
      annee: parseInt(formData.get("annee") as string),
      ordre: formData.get("ordre") ? parseInt(formData.get("ordre") as string) : undefined,
      notes: formData.get("notes") || "",
    };

    try {
      const url = `/api/data-liste/${currentIndicatorId}/items${
        editingItem ? `/${editingItem._id}` : ""
      }`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (res.ok) {
        setIsItemModalOpen(false);
        setEditingItem(null);
        setCurrentIndicatorId("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet indicateur et tous ses items ?"))
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
      const res = await fetch(`/api/data-liste/${indicatorId}/items/${itemId}`, {
        method: "DELETE",
      });

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
          className="flex items-center space-x-2 px-4 py-2 bg-bleu-rdc hover:bg-bleu-rdc/90 text-white rounded-lg transition-colors"
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
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Ajouter un item LMMA"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setEditingData(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Modifier"
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
                  {item.items.slice(0, 3).map((lmma, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {lmma.loisMesuresActions.titre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {lmma.loisMesuresActions.type} - {lmma.annee}
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
                          onClick={() => handleDeleteItem(item._id, (lmma as { _id?: string })._id || "")}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                  Indicateur *
                </label>
                <select
                  name="indicateur"
                  required
                  defaultValue={editingData?.indicateur._id}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Sélectionner un indicateur</option>
                  {indicateurs?.map((ind) => (
                    <option key={ind._id} value={ind._id}>
                      {ind.code} - {ind.nom}
                    </option>
                  ))}
                </select>
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
                  className="px-6 py-2 bg-bleu-rdc hover:bg-bleu-rdc/90 text-white rounded-lg transition-colors"
                >
                  {editingData ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Item CRUD */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? "Modifier l'Item LMMA" : "Nouvel Item LMMA"}
              </h2>
              <button
                onClick={() => {
                  setIsItemModalOpen(false);
                  setEditingItem(null);
                  setCurrentIndicatorId("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre de la Loi/Mesure/Action *
                </label>
                <input
                  type="text"
                  name="lmaTitre"
                  required
                  defaultValue={editingItem?.loisMesuresActions?.titre}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Loi sur la parité..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  name="lmaType"
                  required
                  defaultValue={editingItem?.loisMesuresActions?.type}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Loi">Loi</option>
                  <option value="Mesure">Mesure</option>
                  <option value="Action">Action</option>
                  <option value="Politique">Politique</option>
                  <option value="Mécanisme">Mécanisme</option>
                </select>
              </div>

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
                    Ordre
                  </label>
                  <input
                    type="number"
                    name="ordre"
                    defaultValue={editingItem?.ordre}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 1, 2, 3..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
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
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-bleu-rdc hover:bg-bleu-rdc/90 text-white rounded-lg transition-colors"
                >
                  {editingItem ? "Mettre à jour" : "Ajouter"}
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
                  {selectedData.items?.map((lmma: {
                    loisMesuresActions: { titre: string; type: string };
                    annee: number;
                    ordre?: number;
                    notes?: string;
                  }, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {lmma.ordre ? `${lmma.ordre}. ` : ""}
                            {lmma.loisMesuresActions.titre}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-medium">{lmma.loisMesuresActions.type}</span>{" "}
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
                  ))}
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
