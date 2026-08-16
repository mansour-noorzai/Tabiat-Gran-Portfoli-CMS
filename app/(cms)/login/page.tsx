import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  if (await getActiveSession()) {
    redirect("/admin");
  }

  return (
    <main className="login-page">
      <LoginForm />
    </main>
  );
}
