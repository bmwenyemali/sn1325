"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  BarChart3,
  Database,
  Users,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: {
    name: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    {
      name: "Données",
      href: "/admin/dashboard/donnees",
      icon: BarChart3,
      submenu: [
        {
          name: "Données Numériques",
          href: "/admin/dashboard/donnees/data-numeric",
        },
        { name: "Données Liste", href: "/admin/dashboard/donnees/data-liste" },
        {
          name: "Données Province",
          href: "/admin/dashboard/donnees/data-province",
        },
      ],
    },
    {
      name: "Références",
      href: "/admin/dashboard/referentiel",
      icon: Database,
      submenu: [
        {
          name: "Axes Stratégiques",
          href: "/admin/dashboard/referentiel/axes",
        },
        {
          name: "Indicateurs",
          href: "/admin/dashboard/referentiel/indicateurs",
        },
        {
          name: "Grandes Catégories",
          href: "/admin/dashboard/referentiel/grandes-categories",
        },
        { name: "Catégories", href: "/admin/dashboard/referentiel/categories" },
        { name: "Cibles", href: "/admin/dashboard/referentiel/cibles" },
        { name: "Provinces", href: "/admin/dashboard/referentiel/provinces" },
        { name: "Sexe", href: "/admin/dashboard/referentiel/sexe" },
        { name: "Type", href: "/admin/dashboard/referentiel/type" },
        { name: "Années", href: "/admin/dashboard/referentiel/annees" },
      ],
    },
    {
      name: "Structures",
      href: "/admin/dashboard/structures",
      icon: Users,
    },
    {
      name: "Utilisateurs",
      href: "/admin/dashboard/utilisateurs",
      icon: Shield,
    },
    {
      name: "Paramètres",
      href: "/admin/dashboard/parametres",
      icon: Settings,
      submenu: [
        {
          name: "Configuration",
          href: "/admin/dashboard/parametres/configuration",
        },
        { name: "À propos", href: "/admin/dashboard/parametres/about" },
        { name: "Contact", href: "/admin/dashboard/parametres/contact" },
      ],
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl">
            <SidebarContent
              navigation={navigation}
              isActive={isActive}
              closeSidebar={() => setSidebarOpen(false)}
              session={session}
            />
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <SidebarContent
            navigation={navigation}
            isActive={isActive}
            session={session}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-none bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
          {/* Mobile header */}
          <div className="flex h-16 items-center gap-x-4 px-4 sm:px-6 lg:px-8 lg:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getPageTitle(pathname)}
            </h1>
            <div className="ml-auto flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-bleu-rdc flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {session?.user?.prenom?.charAt(0)}
                  {session?.user?.nom?.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop horizontal menu */}
          <div className="hidden lg:flex items-center justify-between px-6 h-16">
            <nav className="flex space-x-1">
              <Link
                href="/admin/dashboard"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === "/admin/dashboard"
                    ? "bg-bleu-rdc text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/dashboard/donnees"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith("/admin/dashboard/donnees")
                    ? "bg-bleu-rdc text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                Données
              </Link>
              <Link
                href="/admin/dashboard/referentiel"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith("/admin/dashboard/referentiel")
                    ? "bg-bleu-rdc text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                Références
              </Link>
              <Link
                href="/admin/dashboard/structures"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === "/admin/dashboard/structures"
                    ? "bg-bleu-rdc text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                Structures
              </Link>
              <Link
                href="/admin/dashboard/utilisateurs"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === "/admin/dashboard/utilisateurs"
                    ? "bg-bleu-rdc text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                Utilisateurs
              </Link>
              <Link
                href="/admin/dashboard/parametres"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith("/admin/dashboard/parametres")
                    ? "bg-bleu-rdc text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                Paramètres
              </Link>
            </nav>

            <div className="flex items-center gap-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-bleu-rdc flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {session?.user?.prenom?.charAt(0)}
                      {session?.user?.nom?.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {session?.user?.prenom} {session?.user?.nom}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.user?.fonction}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  navigation,
  isActive,
  closeSidebar,
  session,
}: {
  navigation: NavigationItem[];
  isActive: (href: string) => boolean;
  closeSidebar?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleSubmenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-bleu-rdc rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-bleu-rdc">SN1325</h1>
            <p className="text-xs text-gray-500">Administration</p>
          </div>
        </div>
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="ml-auto lg:hidden p-2 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedMenu === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMenu === item.name && (
                    <ul className="mt-1 ml-8 space-y-1">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {item.submenu.map((subitem: any) => (
                        <li key={subitem.name}>
                          <Link
                            href={subitem.href}
                            onClick={closeSidebar}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(subitem.href)
                                ? "bg-bleu-rdc text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subitem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || "#"}
                  onClick={closeSidebar}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href || "")
                      ? "bg-bleu-rdc text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-bleu-rdc flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {session?.user?.prenom?.charAt(0)}
              {session?.user?.nom?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.prenom} {session?.user?.nom}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.fonction}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </>
  );
}

function getPageTitle(pathname: string): string {
  const titles: { [key: string]: string } = {
    "/admin/dashboard": "Tableau de bord",
    "/admin/dashboard/referentiel": "Références",
    "/admin/dashboard/referentiel/axes": "Axes Stratégiques",
    "/admin/dashboard/referentiel/indicateurs": "Indicateurs",
    "/admin/dashboard/referentiel/grandes-categories": "Grandes Catégories",
    "/admin/dashboard/referentiel/categories": "Catégories",
    "/admin/dashboard/referentiel/cibles": "Cibles",
    "/admin/dashboard/referentiel/provinces": "Provinces",
    "/admin/dashboard/referentiel/sexe": "Sexe",
    "/admin/dashboard/referentiel/type": "Type",
    "/admin/dashboard/referentiel/annees": "Années",
    "/admin/dashboard/donnees": "Données",
    "/admin/dashboard/donnees/data-numeric": "Données Numériques",
    "/admin/dashboard/donnees/data-liste": "Données Liste",
    "/admin/dashboard/donnees/data-province": "Données Province",
    "/admin/dashboard/structures": "Structures",
    "/admin/dashboard/utilisateurs": "Utilisateurs",
    "/admin/dashboard/parametres": "Paramètres",
    "/admin/dashboard/parametres/configuration": "Configuration",
    "/admin/dashboard/parametres/about": "À propos",
    "/admin/dashboard/parametres/contact": "Contact",
  };

  return titles[pathname] || "Administration";
}
