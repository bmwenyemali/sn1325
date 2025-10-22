"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  TrendingUp,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "flex items-center space-x-2 transition-colors";
    if (isActive(path)) {
      return `${baseClasses} text-jaune-rdc dark:text-jaune-rdc font-semibold`;
    }
    return `${baseClasses} text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc`;
  };

  const getMobileLinkClasses = (path: string) => {
    const baseClasses =
      "flex items-center space-x-2 px-4 py-2 transition-colors";
    if (isActive(path)) {
      return `${baseClasses} text-jaune-rdc dark:text-jaune-rdc font-semibold bg-bleu-rdc/10 dark:bg-jaune-rdc/10`;
    }
    return `${baseClasses} text-gray-700 dark:text-gray-300 hover:text-bleu-rdc dark:hover:text-jaune-rdc`;
  };

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
                  className={getLinkClasses("/admin/dashboard")}
                >
                  <Home className="w-4 h-4" />
                  <span>TB</span>
                </Link>
                <Link
                  href="/admin/dashboard/donnees"
                  className={getLinkClasses("/admin/dashboard/donnees")}
                >
                  <Database className="w-4 h-4" />
                  <span>Données</span>
                </Link>
                <Link
                  href="/admin/dashboard/referentiel"
                  className={getLinkClasses("/admin/dashboard/referentiel")}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Références</span>
                </Link>
                <Link
                  href="/admin/dashboard/structures"
                  className={getLinkClasses("/admin/dashboard/structures")}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Structures</span>
                </Link>
                <Link
                  href="/admin/dashboard/utilisateurs"
                  className={getLinkClasses("/admin/dashboard/utilisateurs")}
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/admin/dashboard/parametres"
                  className={getLinkClasses("/admin/dashboard/parametres")}
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
                  className={getLinkClasses("/user/dashboard")}
                >
                  <Home className="w-4 h-4" />
                  <span>Tableau de bord</span>
                </Link>
                <Link
                  href="/user/dashboard/donnees"
                  className={getLinkClasses("/user/dashboard/donnees")}
                >
                  <Database className="w-4 h-4" />
                  <span>Données</span>
                </Link>
                <Link
                  href="/user/dashboard/statistiques"
                  className={getLinkClasses("/user/dashboard/statistiques")}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistiques</span>
                </Link>
                <Link
                  href="/user/dashboard/analyses"
                  className={getLinkClasses("/user/dashboard/analyses")}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Analyses</span>
                </Link>
                <Link
                  href="/user/dashboard/structures"
                  className={getLinkClasses("/user/dashboard/structures")}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Structures</span>
                </Link>
              </>
            )}

            {/* À propos - Always visible */}
            <Link href="/about" className={getLinkClasses("/about")}>
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
                    className={getMobileLinkClasses("/admin/dashboard")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/donnees"
                    className={getMobileLinkClasses("/admin/dashboard/donnees")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Database className="w-4 h-4" />
                    <span>Données</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/referentiel"
                    className={getMobileLinkClasses(
                      "/admin/dashboard/referentiel"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Références</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/structures"
                    className={getMobileLinkClasses(
                      "/admin/dashboard/structures"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Structures</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/utilisateurs"
                    className={getMobileLinkClasses(
                      "/admin/dashboard/utilisateurs"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    <span>Utilisateurs</span>
                  </Link>
                  <Link
                    href="/admin/dashboard/parametres"
                    className={getMobileLinkClasses(
                      "/admin/dashboard/parametres"
                    )}
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
                    className={getMobileLinkClasses("/user/dashboard")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link
                    href="/user/dashboard/donnees"
                    className={getMobileLinkClasses("/user/dashboard/donnees")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Database className="w-4 h-4" />
                    <span>Données</span>
                  </Link>
                  <Link
                    href="/user/dashboard/statistiques"
                    className={getMobileLinkClasses(
                      "/user/dashboard/statistiques"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Statistiques</span>
                  </Link>
                  <Link
                    href="/user/dashboard/analyses"
                    className={getMobileLinkClasses("/user/dashboard/analyses")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Analyses</span>
                  </Link>
                  <Link
                    href="/user/dashboard/structures"
                    className={getMobileLinkClasses(
                      "/user/dashboard/structures"
                    )}
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
                className={getMobileLinkClasses("/about")}
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
