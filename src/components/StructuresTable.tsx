"use client";

import Image from "next/image";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  User,
  X,
  Target,
  Layers,
  Edit2,
  Trash2,
} from "lucide-react";

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

interface StructuresTableProps {
  structures: Structure[];
  onRowClick?: (structure: Structure) => void;
  onEdit?: (structure: Structure) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function StructuresTable({
  structures,
  onRowClick,
  onEdit,
  onDelete,
  showActions = false,
}: StructuresTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Photo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sigle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Axes
            </th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
          {structures.map((structure) => (
            <tr
              key={structure._id}
              onClick={() => onRowClick?.(structure)}
              className="hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex-shrink-0 h-12 w-12">
                  {structure.photo ? (
                    <Image
                      src={structure.photo}
                      alt={structure.nom}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-bleu-rdc/10 dark:bg-jaune-rdc/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-bleu-rdc dark:text-jaune-rdc" />
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {structure.nom}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-300">
                  {structure.sigle || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  {structure.type || "Non spécifié"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {structure.axes && structure.axes.length > 0 ? (
                    structure.axes.slice(0, 2).map((axe) => (
                      <span
                        key={axe._id}
                        className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded"
                      >
                        Axe {axe.numero}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                  {structure.axes && structure.axes.length > 2 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                      +{structure.axes.length - 2}
                    </span>
                  )}
                </div>
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(structure);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Modifier"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(structure._id);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {structures.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Aucune structure trouvée
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Essayez de modifier vos filtres
          </p>
        </div>
      )}
    </div>
  );
}

interface StructureDetailModalProps {
  structure: Structure | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StructureDetailModal({
  structure,
  isOpen,
  onClose,
}: StructureDetailModalProps) {
  if (!isOpen || !structure) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-bleu-rdc to-bleu-rdc-700 dark:from-slate-700 dark:to-slate-800 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {structure.photo ? (
                  <Image
                    src={structure.photo}
                    alt={structure.nom}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {structure.nom}
                  </h3>
                  {structure.sigle && (
                    <p className="text-blue-100">{structure.sigle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Type */}
                {structure.type && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Type d&apos;Organisation
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {structure.type}
                    </p>
                  </div>
                )}

                {/* Point Focal */}
                {structure.pointFocal && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Point Focal
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {structure.pointFocal}
                    </p>
                  </div>
                )}

                {/* Contact Organisation */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Contact Organisation
                  </label>
                  <div className="mt-1 space-y-2">
                    {structure.email && (
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a
                          href={`mailto:${structure.email}`}
                          className="hover:underline"
                        >
                          {structure.email}
                        </a>
                      </div>
                    )}
                    {structure.telephone && (
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {structure.telephone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Privé */}
                {(structure.emailPrive || structure.telephonePrive) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Contact Privé
                    </label>
                    <div className="mt-1 space-y-2">
                      {structure.emailPrive && (
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <a
                            href={`mailto:${structure.emailPrive}`}
                            className="hover:underline"
                          >
                            {structure.emailPrive}
                          </a>
                        </div>
                      )}
                      {structure.telephonePrive && (
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {structure.telephonePrive}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Site Web */}
                {structure.siteWeb && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Site Web
                    </label>
                    <p className="mt-1">
                      <a
                        href={structure.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bleu-rdc dark:text-jaune-rdc hover:underline"
                      >
                        {structure.siteWeb}
                      </a>
                    </p>
                  </div>
                )}

                {/* Adresse */}
                {structure.adresse && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Adresse
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {structure.adresse}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Axes Stratégiques */}
                {structure.axes && structure.axes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Layers className="w-4 h-4 mr-2" />
                      Axes Stratégiques
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {structure.axes.map((axe) => (
                        <span
                          key={axe._id}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-sm"
                        >
                          Axe {axe.numero}: {axe.nom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cibles */}
                {structure.cible && structure.cible.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Cibles
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {structure.cible.map((c) => (
                        <span
                          key={c._id}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm"
                        >
                          {c.nom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Provinces */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Couverture Géographique
                  </label>
                  {structure.isNational ? (
                    <p className="mt-2">
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full text-sm font-semibold">
                        National (Toutes les provinces)
                      </span>
                    </p>
                  ) : structure.provinces && structure.provinces.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {structure.provinces.map((province) => (
                        <span
                          key={province._id}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm"
                        >
                          {province.nom}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-400">Non spécifié</p>
                  )}
                </div>
              </div>
            </div>

            {/* À Propos - Full Width */}
            {structure.aPropos && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  À Propos
                </label>
                <p className="mt-2 text-gray-900 dark:text-white whitespace-pre-line">
                  {structure.aPropos}
                </p>
              </div>
            )}

            {/* Adresse Géographique (Placeholder for Google Maps) */}
            {structure.adresseGeographic &&
              (structure.adresseGeographic.latitude ||
                structure.adresseGeographic.longitude) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Localisation GPS
                  </label>
                  <div className="mt-2 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Latitude:</strong>{" "}
                      {structure.adresseGeographic.latitude}
                      <br />
                      <strong>Longitude:</strong>{" "}
                      {structure.adresseGeographic.longitude}
                    </p>
                    {structure.adresseGeographic.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {structure.adresseGeographic.description}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      🗺️ Intégration Google Maps à venir
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-bleu-rdc hover:bg-bleu-rdc-700 dark:bg-jaune-rdc dark:hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
