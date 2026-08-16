import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { getActiveSession } from "@/lib/auth";

export default async function ChangePasswordPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login");
  if (!session.mustChangePassword) redirect("/admin");
  return <main className="login-page"><ChangePasswordForm /></main>;
}
