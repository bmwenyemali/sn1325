import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
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
    <html lang="fr" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
