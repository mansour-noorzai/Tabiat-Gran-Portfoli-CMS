"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/AdminIcon";
import { useAdminPreferences, type AdminLanguage } from "@/components/AdminPreferences";

export default function ChangePasswordForm() {
  const router = useRouter();
  const { language, setLanguage, t } = useAdminPreferences();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const next = String(form.get("newPassword") || "");
    const confirm = String(form.get("confirmPassword") || "");
    if (next !== confirm) {
      setLoading(false);
      setError("New passwords do not match");
      return;
    }
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword: next }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Unable to change password");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="auth-shell single-auth">
      <section className="auth-form-side">
        <form className="login-card password-card" onSubmit={submit}>
          <div className="auth-mobile-brand always"><span className="brand-emblem">TG</span><strong>Tabiat Gran CMS</strong></div>
          <div className="auth-card-top"><span className="eyebrow">{t("Account security")}</span><select className="auth-language-select" value={language} onChange={event => setLanguage(event.target.value as AdminLanguage)} aria-label={t("Language")}><option value="en">{t("English")}</option><option value="fa">{t("Dari")}</option><option value="ps">{t("Pashto")}</option></select></div>
          <h2>{t("Change your password")}</h2>
          <p>{t("Your administrator requires a new password before you can continue to the CMS.")}</p>
          <div className="field"><label>{t("Current password")}</label><input className="input auth-input" type="password" name="currentPassword" autoComplete="current-password" required minLength={8} maxLength={72} /></div>
          <div className="field"><label>{t("New password")}</label><input className="input auth-input" type="password" name="newPassword" autoComplete="new-password" required minLength={10} maxLength={72} /></div>
          <div className="field"><label>{t("Confirm new password")}</label><input className="input auth-input" type="password" name="confirmPassword" autoComplete="new-password" required minLength={10} maxLength={72} /></div>
          {error ? <div className="alert alert-error auth-alert">{t(error)}</div> : null}
          <button className="btn btn-primary auth-submit" disabled={loading}><AdminIcon name="check" size={14} />{loading ? t("Updating…") : t("Change password")}</button>
        </form>
      </section>
    </div>
  );
}
