import { redirect } from "next/navigation";
import { requirePagePermission } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePagePermission("dashboard.read");
  if (!session) redirect("/login");
  if (session.mustChangePassword) redirect("/change-password");
  return <AdminShell user={session}>{children}</AdminShell>;
}
