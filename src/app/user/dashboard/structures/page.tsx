"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Search,
  Filter,
} from "lucide-react";

interface Structure {
  _id: string;
  nom: string;
  sigle: string;
  type: string;
  province: { nom: string };
  email: string;
  telephone: string;
  siteWeb?: string;
  description?: string;
}

export default function UserStructuresPage() {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      const response = await fetch("/api/structures");
      if (response.ok) {
        const data = await response.json();
        setStructures(data);
      }
    } catch (error) {
      console.error("Error fetching structures:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStructures = structures.filter((structure) => {
    const matchesSearch =
      structure.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.sigle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || structure.type === typeFilter;
    const matchesProvince =
      provinceFilter === "all" || structure.province?.nom === provinceFilter;
    return matchesSearch && matchesType && matchesProvince;
  });

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
              <option value="Publique">Publique</option>
              <option value="Privée">Privée</option>
              <option value="ONG">ONG</option>
              <option value="Internationale">Internationale</option>
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
              {/* Will be populated dynamically */}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {structures.length}
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
            26
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Provinces Couvertes
          </div>
        </div>
      </div>

      {/* Structures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStructures.map((structure) => (
          <div
            key={structure._id}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-bleu-rdc/10 dark:bg-jaune-rdc/10 p-3 rounded-lg">
                <Building2 className="w-8 h-8 text-bleu-rdc dark:text-jaune-rdc" />
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                {structure.type}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {structure.nom}
            </h3>
            {structure.sigle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-4">
                {structure.sigle}
              </p>
            )}

            {structure.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {structure.description}
              </p>
            )}

            <div className="space-y-2 text-sm">
              {structure.province && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  {structure.province.nom}
                </div>
              )}
              {structure.email && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{structure.email}</span>
                </div>
              )}
              {structure.telephone && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  {structure.telephone}
                </div>
              )}
              {structure.siteWeb && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a
                    href={structure.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {structure.siteWeb}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
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
    </div>
  );
}
