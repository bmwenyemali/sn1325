"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Users,
  BarChart3,
  FileText,
  Home,
  Database,
  BookOpen,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
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
            {/* Admin Menu */}
            {session?.user?.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>TB</span>
                </Link>
                <Link
                  href="/admin/dashboard/donnees/saisie"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Database className="w-4 h-4" />
                  <span>Données</span>
                </Link>
                <Link
                  href="/admin/dashboard/referentiel"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Références</span>
                </Link>
                <Link
                  href="/admin/dashboard/structures"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Structures</span>
                </Link>
                <Link
                  href="/admin/dashboard/utilisateurs"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/admin/dashboard/parametres"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Paramètres</span>
                </Link>
              </>
            )}

            {/* Visitor Menu */}
            {session?.user?.role === "VISITOR" && (
              <>
                <Link
                  href="/user/dashboard"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Tableau de bord</span>
                </Link>
                <Link
                  href="/user/dashboard/donnees"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Database className="w-4 h-4" />
                  <span>Données</span>
                </Link>
                <Link
                  href="/user/dashboard/statistiques"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistiques</span>
                </Link>
                <Link
                  href="/user/dashboard/structures"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Structures</span>
                </Link>
              </>
            )}

            {/* À propos - Always visible */}
            <Link
              href="/about"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>À propos</span>
            </Link>

            <ThemeToggle />

            {/* Login/Logout buttons */}
            {!session ? (
              <Link href="/auth/signin" className="btn-primary">
                Se connecter
              </Link>
            ) : (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
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
              {/* Admin Menu - Mobile */}
              {session?.user?.role === "ADMIN" && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/donnees/saisie"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Database className="w-4 h-4" />
                    <span>Données</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/referentiel"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Références</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/structures"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Structures</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/utilisateurs"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    <span>Utilisateurs</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/parametres"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Paramètres</span>
                  </Link>
                </>
              )}

              {/* Visitor Menu - Mobile */}
              {session?.user?.role === "VISITOR" && (
                <>
                  <Link
                    href="/user/dashboard"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link
                    href="/user/dashboard/donnees"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Database className="w-4 h-4" />
                    <span>Données</span>
                  </Link>
                  <Link
                    href="/user/dashboard/statistiques"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Statistiques</span>
                  </Link>
                  <Link
                    href="/user/dashboard/structures"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Structures</span>
                  </Link>
                </>
              )}

              {/* À propos - Always visible */}
              <Link
                href="/about"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span>À propos</span>
              </Link>

              <div className="px-4 flex items-center gap-3">
                <ThemeToggle />
                {!session ? (
                  <Link
                    href="/auth/signin"
                    className="btn-primary block text-center flex-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center justify-center space-x-2 text-red-400 dark:text-red-300 hover:text-red-700 dark:hover:text-red-300 transition-colors px-4 py-2 border border-red-600 rounded-lg flex-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
