// Simple layout wrapper for admin pages
// Navigation is handled by the global Header component

import { ErrorBoundary } from "@/components/ErrorBoundary";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <main className="container-rdc py-4">{children}</main>
      </div>
    </ErrorBoundary>
  );
}
