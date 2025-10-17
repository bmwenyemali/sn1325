import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs officielles RDC
        "bleu-rdc": "#002B7F",
        "jaune-rdc": "#FCD116",
        "rouge-rdc": "#CE1126",
        // Couleurs secondaires
        "vert-espoir": "#2D5A27",
        "orange-urgence": "#E67E22",
        "violet-feminin": "#8E44AD",
        // Neutres
        "gris-fonce": "#2C3E50",
        "gris-moyen": "#7F8C8D",
        "gris-clair": "#ECF0F1",
        // Variantes pour les états
        "bleu-rdc-50": "#E6F3FF",
        "bleu-rdc-100": "#CCE7FF",
        "bleu-rdc-500": "#002B7F",
        "bleu-rdc-600": "#001F5C",
        "bleu-rdc-700": "#001A4A",
        "bleu-rdc-800": "#001437",
        "bleu-rdc-900": "#000E25",

        "jaune-rdc-50": "#FFFBF0",
        "jaune-rdc-100": "#FFF7E1",
        "jaune-rdc-500": "#FCD116",
        "jaune-rdc-600": "#E5BC00",
        "jaune-rdc-700": "#CCA700",
        "jaune-rdc-800": "#B39200",
        "jaune-rdc-900": "#997D00",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        bounceGentle: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
          "60%": { transform: "translateY(-5px)" },
        },
      },
      boxShadow: {
        rdc: "0 4px 20px rgba(0, 43, 127, 0.1)",
        "rdc-lg": "0 10px 40px rgba(0, 43, 127, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
