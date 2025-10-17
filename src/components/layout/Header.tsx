"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Users, BarChart3, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white dark:bg-slate-900 shadow-lg border-b-4 border-bleu-rdc sticky top-0 z-50 transition-colors">
      <div className="container-rdc">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/LogoSN1325.png"
                alt="Logo SN1325"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-bleu-rdc dark:text-jaune-rdc">
                  SN1325
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  République Démocratique du Congo
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>À propos</span>
            </Link>
            {session && (
              <>
                <Link
                  href="/dashboard/rapports/statistiques"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistiques</span>
                </Link>
                <Link
                  href="/dashboard/referentiel/axes"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Axes Stratégiques</span>
                </Link>
                <Link
                  href="/structures"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Structures</span>
                </Link>
              </>
            )}
            <ThemeToggle />
            {!session ? (
              <Link href="/auth/signin" className="btn-primary">
                Se connecter
              </Link>
            ) : (
              <Link href="/dashboard" className="btn-primary">
                Tableau de Bord
              </Link>
            )}
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-bleu-rdc"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile étendu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/about"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span>À propos</span>
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard/rapports/statistiques"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Statistiques</span>
                  </Link>
                  <Link
                    href="/dashboard/referentiel/axes"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    <span>Axes Stratégiques</span>
                  </Link>
                  <Link
                    href="/structures"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    <span>Structures</span>
                  </Link>
                </>
              )}
              <div className="px-4 flex items-center gap-3">
                <ThemeToggle />
                {!session ? (
                  <Link
                    href="/auth/signin"
                    className="btn-primary block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="btn-primary block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de Bord
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
