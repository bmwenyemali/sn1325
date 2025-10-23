"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useStructures } from "@/hooks/useApi";
import { StructuresTable } from "@/components/StructuresTable";

interface Structure {
  _id: string;
  nom: string;
  sigle?: string;
  type?: string;
  province?: { nom: string };
  email?: string;
  telephone?: string;
  siteWeb?: string;
  description?: string;
  photo?: string;
  axes?: Array<{ _id: string; nom: string; numero: number }>;
  provinces?: Array<{ _id: string; nom: string }>;
}

export default function UserStructuresPage() {
  const { data: structures, loading } = useStructures();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(
    null
  );

  const structuresArray: Structure[] = structures || [];

  const filteredStructures = structuresArray.filter((structure) => {
    const matchesSearch =
      !searchTerm ||
      structure.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.sigle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || structure.type === typeFilter;
    const matchesProvince =
      provinceFilter === "all" || structure.province?.nom === provinceFilter;
    return matchesSearch && matchesType && matchesProvince;
  });

  // Get unique provinces and types for filters
  const uniqueProvinces = Array.from(
    new Set(structuresArray.map((s) => s.province?.nom).filter(Boolean))
  ).sort();

  const uniqueTypes = Array.from(
    new Set(structuresArray.map((s) => s.type).filter(Boolean))
  ).sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bleu-rdc"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Structures Partenaires
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez la liste des organisations impliquées dans la mise en œuvre
          de la Résolution 1325
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom ou sigle..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Province
            </label>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Toutes les provinces</option>
              {uniqueProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {structuresArray.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Structures
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredStructures.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Résultats Filtrés
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {uniqueProvinces.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Provinces Couvertes
          </div>
        </div>
      </div>

      {/* Structures Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <StructuresTable
          structures={filteredStructures}
          onRowClick={(structure) => setSelectedStructure(structure)}
          showActions={false}
        />
      </div>

      {filteredStructures.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-lg">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune structure trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}

      {/* Modal de détails */}
      {selectedStructure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedStructure.nom}
                  </h2>
                  {selectedStructure.sigle && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-semibold">
                      {selectedStructure.sigle}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedStructure(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
                    {selectedStructure.type}
                  </span>
                </div>

                {selectedStructure.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedStructure.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-slate-700">
                  {selectedStructure.province && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Province
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedStructure.province.nom}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedStructure.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Email
                        </p>
                        <a
                          href={`mailto:${selectedStructure.email}`}
                          className="text-sm text-bleu-rdc dark:text-jaune-rdc hover:underline"
                        >
                          {selectedStructure.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedStructure.telephone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Téléphone
                        </p>
                        <a
                          href={`tel:${selectedStructure.telephone}`}
                          className="text-sm text-bleu-rdc dark:text-jaune-rdc hover:underline"
                        >
                          {selectedStructure.telephone}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedStructure.siteWeb && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Site Web
                        </p>
                        <a
                          href={
                            selectedStructure.siteWeb.startsWith("http")
                              ? selectedStructure.siteWeb
                              : `https://${selectedStructure.siteWeb}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-bleu-rdc dark:text-jaune-rdc hover:underline"
                        >
                          {selectedStructure.siteWeb}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {selectedStructure.axes &&
                  selectedStructure.axes.length > 0 && (
                    <div className="pt-4 border-t dark:border-slate-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Axes Stratégiques
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStructure.axes.map((axe) => (
                          <span
                            key={axe._id}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-sm rounded-full"
                          >
                            Axe {axe.numero}: {axe.nom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedStructure(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
