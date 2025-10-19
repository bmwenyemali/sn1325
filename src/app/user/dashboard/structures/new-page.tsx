"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useStructures, useAxes, useProvinces } from "@/hooks/useApi";
import {
  StructuresTable,
  StructureDetailModal,
} from "@/components/StructuresTable";

interface Structure {
  _id: string;
  nom: string;
  sigle?: string;
  type?: string;
  photo?: string;
  telephone?: string;
  telephonePrive?: string;
  email?: string;
  emailPrive?: string;
  siteWeb?: string;
  adresse?: string;
  aPropos?: string;
  pointFocal?: string;
  axes?: Array<{ _id: string; nom: string; numero: number }>;
  cible?: Array<{ _id: string; nom: string }>;
  provinces?: Array<{ _id: string; nom: string }>;
  isNational?: boolean;
  adresseGeographic?: {
    latitude?: number;
    longitude?: number;
    description?: string;
  };
}

export default function UserStructuresPage() {
  const { data: structures, loading } = useStructures();
  const { data: axes } = useAxes();
  const { data: provinces } = useProvinces();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [axeFilter, setAxeFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const structuresArray: Structure[] = structures || [];
  const axesArray = axes || [];
  const provincesArray = provinces || [];

  // Filter structures
  const filteredStructures = structuresArray.filter((structure) => {
    const matchesSearch =
      structure.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.sigle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || structure.type === typeFilter;

    const matchesAxe =
      axeFilter === "all" ||
      structure.axes?.some((axe) => axe._id === axeFilter);

    const matchesProvince =
      provinceFilter === "all" ||
      structure.isNational ||
      structure.provinces?.some((province) => province._id === provinceFilter);

    return matchesSearch && matchesType && matchesAxe && matchesProvince;
  });

  // Get unique types
  const uniqueTypes = Array.from(
    new Set(structuresArray.map((s) => s.type).filter(Boolean))
  ).sort();

  const handleRowClick = (structure: Structure) => {
    setSelectedStructure(structure);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStructure(null), 300);
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
      {/* Header */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
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

          {/* Type Filter */}
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

          {/* Axe Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Axe Stratégique
            </label>
            <select
              value={axeFilter}
              onChange={(e) => setAxeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les axes</option>
              {axesArray.map((axe) => (
                <option key={axe._id} value={axe._id}>
                  Axe {axe.numero}: {axe.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Province
            </label>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Toutes les provinces</option>
              {provincesArray.map((province) => (
                <option key={province._id} value={province._id}>
                  {province.nom}
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
            {uniqueTypes.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Types d&apos;Organisations
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <StructuresTable
          structures={filteredStructures}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Detail Modal */}
      <StructureDetailModal
        structure={selectedStructure}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
