"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CtaLink() {
  const { data: session } = useSession();
  const href = session ? "/dashboard" : "/auth/signin";
  return (
    <Link
      href={href}
      className="bg-jaune-rdc text-bleu-rdc font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
    >
      Accéder au Tableau de Bord
    </Link>
  );
}
