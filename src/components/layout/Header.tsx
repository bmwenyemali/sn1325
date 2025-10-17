"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Users, BarChart3, FileText } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-lg border-b-4 border-bleu-rdc sticky top-0 z-50">
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
                <h1 className="text-xl font-bold text-bleu-rdc">SN1325</h1>
                <p className="text-xs text-gray-600">
                  République Démocratique du Congo
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#about"
              className="flex items-center space-x-2 text-gray-700 hover:text-bleu-rdc transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>À propos</span>
            </Link>
            <Link
              href="#stats"
              className="flex items-center space-x-2 text-gray-700 hover:text-bleu-rdc transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistiques</span>
            </Link>
            <Link
              href="#axes"
              className="flex items-center space-x-2 text-gray-700 hover:text-bleu-rdc transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Axes Stratégiques</span>
            </Link>
            <Link href="/auth/signin" className="btn-primary">
              Se connecter
            </Link>
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-bleu-rdc hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bleu-rdc"
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
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#about"
                className="flex items-center space-x-2 text-gray-700 hover:text-bleu-rdc transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span>À propos</span>
              </Link>
              <Link
                href="#stats"
                className="flex items-center space-x-2 text-gray-700 hover:text-bleu-rdc transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Statistiques</span>
              </Link>
              <Link
                href="#axes"
                className="flex items-center space-x-2 text-gray-700 hover:text-bleu-rdc transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                <span>Axes Stratégiques</span>
              </Link>
              <div className="px-4">
                <Link
                  href="/auth/signin"
                  className="btn-primary block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
