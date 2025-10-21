// Simple layout wrapper for visitor pages
// Navigation is handled by the global Header component

import { ErrorBoundary } from "@/components/ErrorBoundary";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <main className="container-rdc py-8">{children}</main>
      </div>
    </ErrorBoundary>
  );
}
