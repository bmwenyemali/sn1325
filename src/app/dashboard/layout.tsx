"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bleu-rdc border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    redirect("/");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
