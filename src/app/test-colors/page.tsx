export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-bleu-rdc mb-8">
          Test des Couleurs RDC
        </h1>

        {/* Test des couleurs principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Bleu RDC</h2>
            <div className="space-y-2">
              <div className="w-full h-12 bg-bleu-rdc rounded flex items-center justify-center text-white font-medium">
                bg-bleu-rdc
              </div>
              <div className="w-full h-12 bg-bleu-rdc-50 rounded flex items-center justify-center text-gray-800">
                bg-bleu-rdc-50
              </div>
              <div className="w-full h-12 bg-bleu-rdc-100 rounded flex items-center justify-center text-gray-800">
                bg-bleu-rdc-100
              </div>
              <div className="w-full h-12 bg-bleu-rdc-700 rounded flex items-center justify-center text-white">
                bg-bleu-rdc-700
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Jaune RDC</h2>
            <div className="space-y-2">
              <div className="w-full h-12 bg-jaune-rdc rounded flex items-center justify-center text-gray-800 font-medium">
                bg-jaune-rdc
              </div>
              <div className="w-full h-12 bg-jaune-rdc-50 rounded flex items-center justify-center text-gray-800">
                bg-jaune-rdc-50
              </div>
              <div className="w-full h-12 bg-jaune-rdc-100 rounded flex items-center justify-center text-gray-800">
                bg-jaune-rdc-100
              </div>
              <div className="w-full h-12 bg-jaune-rdc-600 rounded flex items-center justify-center text-white">
                bg-jaune-rdc-600
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Rouge RDC</h2>
            <div className="space-y-2">
              <div className="w-full h-12 bg-rouge-rdc rounded flex items-center justify-center text-white font-medium">
                bg-rouge-rdc
              </div>
              <div className="w-full h-12 bg-red-100 rounded flex items-center justify-center text-gray-800">
                bg-red-100 (fallback)
              </div>
              <div className="w-full h-12 bg-red-500 rounded flex items-center justify-center text-white">
                bg-red-500 (fallback)
              </div>
            </div>
          </div>
        </div>

        {/* Test des couleurs de texte */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Couleurs de Texte</h2>
          <div className="space-y-2">
            <p className="text-bleu-rdc text-lg font-medium">
              Texte en bleu RDC (text-bleu-rdc)
            </p>
            <p className="text-jaune-rdc text-lg font-medium bg-gray-800 p-2 rounded">
              Texte en jaune RDC (text-jaune-rdc)
            </p>
            <p className="text-rouge-rdc text-lg font-medium">
              Texte en rouge RDC (text-rouge-rdc)
            </p>
          </div>
        </div>

        {/* Test des boutons */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Boutons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-bleu-rdc hover:bg-bleu-rdc-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Bouton Bleu RDC
            </button>
            <button className="bg-jaune-rdc hover:bg-jaune-rdc-600 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
              Bouton Jaune RDC
            </button>
            <button className="bg-rouge-rdc hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Bouton Rouge RDC
            </button>
            <button className="border-2 border-bleu-rdc text-bleu-rdc hover:bg-bleu-rdc hover:text-white px-6 py-3 rounded-lg font-medium transition-all">
              Bouton Outline
            </button>
          </div>
        </div>

        {/* Test direct avec style inline */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test Style Inline (fallback)
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div
              style={{ backgroundColor: "#002B7F" }}
              className="h-16 rounded flex items-center justify-center text-white font-medium"
            >
              Bleu RDC Direct
            </div>
            <div
              style={{ backgroundColor: "#FCD116" }}
              className="h-16 rounded flex items-center justify-center text-gray-800 font-medium"
            >
              Jaune RDC Direct
            </div>
            <div
              style={{ backgroundColor: "#CE1126" }}
              className="h-16 rounded flex items-center justify-center text-white font-medium"
            >
              Rouge RDC Direct
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
