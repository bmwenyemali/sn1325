"use client";

import { useState, useEffect } from "react";
import {
  Save,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Province {
  _id: string;
  nom: string;
  code: string;
}

interface Axe {
  _id: string;
  nom: string;
}

interface Indicateur {
  _id: string;
  nom: string;
  code: string;
  type: "quantitatif" | "qualitatif";
  axe: string | { _id: string; nom: string };
  unitesMesure: string[];
}

interface DataValue {
  indicateurId: string;
  valeurNumerique?: number;
  valeurTexte?: string;
  uniteMesure: string;
  commentaire?: string;
}

export default function SaisiePage() {
  const [step, setStep] = useState(1);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [axes, setAxes] = useState<Axe[]>([]);
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
  const [filteredIndicateurs, setFilteredIndicateurs] = useState<Indicateur[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Form data
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedAxe, setSelectedAxe] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedTrimestre, setSelectedTrimestre] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("2025");
  const [dataValues, setDataValues] = useState<DataValue[]>([]);

  const periodes = [
    { value: "mensuel", label: "Mensuel" },
    { value: "trimestriel", label: "Trimestriel" },
    { value: "semestriel", label: "Semestriel" },
    { value: "annuel", label: "Annuel" },
  ];

  const trimestres = [
    { value: "T1", label: "T1 (Jan-Mar)" },
    { value: "T2", label: "T2 (Avr-Juin)" },
    { value: "T3", label: "T3 (Juil-Sep)" },
    { value: "T4", label: "T4 (Oct-Déc)" },
  ];

  const annees = ["2023", "2024", "2025", "2026"];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAxe) {
      const filtered = indicateurs.filter((ind) => {
        const axeId = typeof ind.axe === "object" ? ind.axe._id : ind.axe;
        return axeId === selectedAxe;
      });
      setFilteredIndicateurs(filtered);
      // Initialize data values for filtered indicators
      const initialValues = filtered.map((ind) => ({
        indicateurId: ind._id,
        uniteMesure: ind.unitesMesure[0] || "",
        valeurNumerique: ind.type === "quantitatif" ? undefined : undefined,
        valeurTexte: ind.type === "qualitatif" ? "" : undefined,
        commentaire: "",
      }));
      setDataValues(initialValues);
    } else {
      setFilteredIndicateurs([]);
      setDataValues([]);
    }
  }, [selectedAxe, indicateurs]);

  const fetchData = async () => {
    try {
      // Fetch provinces
      const provincesRes = await fetch("/api/provinces");
      const provincesData = await provincesRes.json();
      if (provincesData.success) setProvinces(provincesData.data);

      // Fetch axes
      const axesRes = await fetch("/api/axes");
      const axesData = await axesRes.json();
      if (axesData.success) setAxes(axesData.data);

      // Fetch indicateurs
      const indicateursRes = await fetch("/api/indicateurs");
      const indicateursData = await indicateursRes.json();
      if (indicateursData.success) setIndicateurs(indicateursData.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDataValue = (
    indicateurId: string,
    field: keyof DataValue,
    value: string | number | undefined
  ) => {
    setDataValues((prev) =>
      prev.map((dv) =>
        dv.indicateurId === indicateurId ? { ...dv, [field]: value } : dv
      )
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        provinceId: selectedProvince,
        axeId: selectedAxe,
        periode: selectedPeriode,
        trimestre: selectedTrimestre,
        annee: selectedAnnee,
        donnees: dataValues.filter(
          (dv) =>
            (dv.valeurNumerique !== undefined && dv.valeurNumerique !== null) ||
            (dv.valeurTexte && dv.valeurTexte.trim() !== "")
        ),
      };

      console.log("Données à sauvegarder:", formData);

      // Here you would make the API call to save the data
      // await saveData(formData);

      alert("Données sauvegardées avec succès !");

      // Reset form
      setSelectedProvince("");
      setSelectedAxe("");
      setSelectedPeriode("");
      setSelectedTrimestre("");
      setDataValues([]);
      setStep(1);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde des données");
    }
  };

  const canProceedStep1 =
    selectedProvince && selectedAxe && selectedPeriode && selectedAnnee;
  const canProceedStep2 =
    selectedPeriode !== "trimestriel" || selectedTrimestre;
  const hasDataToSave = dataValues.some(
    (dv) =>
      (dv.valeurNumerique !== undefined && dv.valeurNumerique !== null) ||
      (dv.valeurTexte && dv.valeurTexte.trim() !== "")
  );

  if (loading) {
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Saisie des Données
        </h1>
        <p className="text-gray-600">
          Enregistrez les données des indicateurs par province et période
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? "bg-bleu-rdc text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step > stepNumber ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-16 h-0.5 ${
                    step > stepNumber ? "bg-bleu-rdc" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-16">
            <span
              className={`text-sm ${
                step >= 1 ? "text-bleu-rdc font-medium" : "text-gray-500"
              }`}
            >
              Sélection
            </span>
            <span
              className={`text-sm ${
                step >= 2 ? "text-bleu-rdc font-medium" : "text-gray-500"
              }`}
            >
              Période
            </span>
            <span
              className={`text-sm ${
                step >= 3 ? "text-bleu-rdc font-medium" : "text-gray-500"
              }`}
            >
              Données
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Étape 1: Sélection de la province et de l&apos;axe
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Axe stratégique <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAxe}
                  onChange={(e) => setSelectedAxe(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un axe</option>
                  {axes.map((axe) => (
                    <option key={axe._id} value={axe._id}>
                      {axe.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de période <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une période</option>
                  {periodes.map((periode) => (
                    <option key={periode.value} value={periode.value}>
                      {periode.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAnnee}
                  onChange={(e) => setSelectedAnnee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  required
                >
                  {annees.map((annee) => (
                    <option key={annee} value={annee}>
                      {annee}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Period Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Étape 2: Précision de la période
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">
                    Période sélectionnée
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Type:{" "}
                    {periodes.find((p) => p.value === selectedPeriode)?.label} |
                    Année: {selectedAnnee}
                  </p>
                </div>
              </div>
            </div>

            {selectedPeriode === "trimestriel" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trimestre <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTrimestre}
                  onChange={(e) => setSelectedTrimestre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un trimestre</option>
                  {trimestres.map((trimestre) => (
                    <option key={trimestre.value} value={trimestre.value}>
                      {trimestre.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedPeriode === "mensuel" && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Pour la saisie mensuelle, vous pourrez spécifier le mois
                  précis dans l&apos;étape suivante.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Data Entry */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Étape 3: Saisie des données
            </h2>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">
                    Configuration confirmée
                  </h3>
                  <p className="text-green-700 text-sm">
                    Province:{" "}
                    {provinces.find((p) => p._id === selectedProvince)?.nom} |
                    Axe: {axes.find((a) => a._id === selectedAxe)?.nom} |
                    Période:{" "}
                    {periodes.find((p) => p.value === selectedPeriode)?.label}{" "}
                    {selectedAnnee}
                    {selectedTrimestre && ` - ${selectedTrimestre}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {filteredIndicateurs.map((indicateur) => {
                const dataValue = dataValues.find(
                  (dv) => dv.indicateurId === indicateur._id
                );

                return (
                  <div
                    key={indicateur._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-900">
                        {indicateur.nom}
                      </h3>
                      <p className="text-sm text-gray-500">{indicateur.code}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {indicateur.type === "quantitatif" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valeur numérique
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={dataValue?.valeurNumerique || ""}
                            onChange={(e) =>
                              updateDataValue(
                                indicateur._id,
                                "valeurNumerique",
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                            placeholder="Entrer la valeur"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valeur qualitative
                          </label>
                          <textarea
                            rows={2}
                            value={dataValue?.valeurTexte || ""}
                            onChange={(e) =>
                              updateDataValue(
                                indicateur._id,
                                "valeurTexte",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                            placeholder="Entrer la description qualitative"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unité de mesure
                        </label>
                        <select
                          value={dataValue?.uniteMesure || ""}
                          onChange={(e) =>
                            updateDataValue(
                              indicateur._id,
                              "uniteMesure",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                        >
                          {indicateur.unitesMesure.map((unite) => (
                            <option key={unite} value={unite}>
                              {unite}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commentaire (optionnel)
                      </label>
                      <textarea
                        rows={2}
                        value={dataValue?.commentaire || ""}
                        onChange={(e) =>
                          updateDataValue(
                            indicateur._id,
                            "commentaire",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bleu-rdc focus:border-transparent"
                        placeholder="Ajouter un commentaire ou une note explicative"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              step === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>

          <div className="flex gap-2">
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2)
                }
                className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-bleu-rdc text-white hover:bg-bleu-rdc-700"
                }`}
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hasDataToSave}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                  !hasDataToSave
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
