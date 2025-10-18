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
  Building2,
  FileText,
  LogOut,
  Bell,
  User,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/user/dashboard", icon: Home },
    { name: "Données", href: "/user/dashboard/donnees", icon: Database },
    {
      name: "Statistiques",
      href: "/user/dashboard/statistiques",
      icon: BarChart3,
    },
    { name: "Structures", href: "/user/dashboard/structures", icon: Building2 },
    { name: "À Propos", href: "/user/dashboard/a-propos", icon: FileText },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/70"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h2 className="text-xl font-bold text-bleu-rdc dark:text-jaune-rdc">
                Portail Utilisateur
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-bleu-rdc text-white dark:bg-jaune-rdc dark:text-bleu-rdc"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main container */}
      <div className="flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-800 shadow-md border-b-4 border-bleu-rdc dark:border-jaune-rdc sticky top-0 z-40">
          <div className="px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Mobile menu button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-bleu-rdc dark:bg-jaune-rdc rounded-full flex items-center justify-center">
                    <span className="text-white dark:text-bleu-rdc font-bold text-xl">
                      SN
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-bleu-rdc dark:text-jaune-rdc">
                      SN1325
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Portail Utilisateur
                    </p>
                  </div>
                </Link>
              </div>

              {/* Horizontal Navigation - Desktop */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive(item.href)
                          ? "bg-bleu-rdc text-white dark:bg-jaune-rdc dark:text-bleu-rdc font-semibold shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 relative">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {session?.user?.name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {session?.user?.role || "USER"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 border-t dark:border-slate-700 py-6 mt-auto">
          <div className="px-4 lg:px-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Secrétariat National 1325 - République Démocratique du
              Congo
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
