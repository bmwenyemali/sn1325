"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogIn, LayoutDashboard } from "lucide-react";

export default function CtaLink() {
  const { data: session } = useSession();

  // Determine href and button text based on authentication and role
  let href = "/auth/signin";
  let buttonText = "Se Connecter";
  let icon = <LogIn className="w-5 h-5" />;

  if (session) {
    // Redirect based on role: ADMIN to /admin/dashboard, others to /user/dashboard
    href =
      session.user?.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";
    buttonText = "Accéder au Tableau de Bord";
    icon = <LayoutDashboard className="w-5 h-5" />;
  }

  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold
                 bg-transparent border-2 border-white dark:border-white 
                 text-white dark:text-white
                 hover:bg-white hover:text-bleu-rdc dark:hover:bg-white dark:hover:text-bleu-rdc
                 transition-all duration-300 ease-in-out
                 hover:scale-105 hover:shadow-2xl
                 animate-pulse-subtle"
    >
      <span className="relative z-10 flex items-center gap-3">
        {icon}
        {buttonText}
      </span>

      {/* Animated gradient background on hover */}
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-r from-jaune-rdc to-white 
                       opacity-0 group-hover:opacity-20 transition-opacity duration-300"
      ></span>
    </Link>
  );
}
