"use client";

import { useState } from "react";
import { Phone, Save, Mail, MapPin, Globe, Clock } from "lucide-react";

export default function ContactPage() {
  const [saving, setSaving] = useState(false);
  const [contact, setContact] = useState({
    organizationName: "Ministère de la Justice - Burundi",
    address: "Avenue de la Justice, Bujumbura, Burundi",
    email: "contact@justice.gov.bi",
    phone: "+257 22 XX XX XX",
    fax: "+257 22 XX XX XX",
    website: "https://www.justice.gov.bi",
    openingHours: "Lundi - Vendredi: 8h00 - 17h00",
    emergencyContact: "+257 XX XX XX XX",
    socialMedia: {
      facebook: "https://facebook.com/ministere.justice.bi",
      twitter: "https://twitter.com/justice_bi",
      linkedin: "https://linkedin.com/company/ministere-justice-burundi",
    },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save contact info
      // const response = await fetch("/api/contact", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(contact),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Informations de contact enregistrées avec succès");
    } catch (error) {
      console.error("Error saving contact:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Phone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gérer les informations de contact de l&apos;organisation
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Organization Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informations de l&apos;organisation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de l&apos;organisation
                </label>
                <input
                  type="text"
                  value={contact.organizationName}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      organizationName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <MapPin className="h-4 w-4" />
                  Adresse physique
                </label>
                <textarea
                  value={contact.address}
                  onChange={(e) =>
                    setContact({ ...contact, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Coordonnées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fax
                </label>
                <input
                  type="tel"
                  value={contact.fax}
                  onChange={(e) =>
                    setContact({ ...contact, fax: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe className="h-4 w-4" />
                  Site Web
                </label>
                <input
                  type="url"
                  value={contact.website}
                  onChange={(e) =>
                    setContact({ ...contact, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Clock className="h-4 w-4" />
                  Heures d&apos;ouverture
                </label>
                <input
                  type="text"
                  value={contact.openingHours}
                  onChange={(e) =>
                    setContact({ ...contact, openingHours: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact d&apos;urgence
                </label>
                <input
                  type="tel"
                  value={contact.emergencyContact}
                  onChange={(e) =>
                    setContact({ ...contact, emergencyContact: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Réseaux Sociaux
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.facebook}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      socialMedia: {
                        ...contact.socialMedia,
                        facebook: e.target.value,
                      },
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Twitter / X
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.twitter}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      socialMedia: {
                        ...contact.socialMedia,
                        twitter: e.target.value,
                      },
                    })
                  }
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.linkedin}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      socialMedia: {
                        ...contact.socialMedia,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
