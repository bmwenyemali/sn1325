// Simple layout wrapper for admin pages
// Navigation is handled by the global Header component

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <main className="container-rdc py-8">{children}</main>
    </div>
  );
}
