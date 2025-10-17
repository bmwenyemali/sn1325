import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SN1325 RDC - Suivi de la Résolution 1325",
  description:
    "Application de monitoring de la Résolution 1325 du Conseil de Sécurité des Nations Unies sur les Femmes, la Paix et la Sécurité en République Démocratique du Congo",
  keywords: [
    "SN1325",
    "RDC",
    "Résolution 1325",
    "Femmes",
    "Paix",
    "Sécurité",
    "Congo",
  ],
  authors: [{ name: "Ministère du Genre, Famille et Enfant - RDC" }],
  openGraph: {
    title: "SN1325 RDC - Suivi de la Résolution 1325",
    description:
      "Application de monitoring de la Résolution 1325 en République Démocratique du Congo",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${inter.variable} ${poppins.variable}`}
    >
      <head>
        <link rel="icon" href="/LogoSN1325.png" type="image/png" />
      </head>
      <body className="bg-gray-50 font-sans">
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
