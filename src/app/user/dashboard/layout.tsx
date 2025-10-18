import { UserLayout } from "@/components/layout/UserLayout";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
