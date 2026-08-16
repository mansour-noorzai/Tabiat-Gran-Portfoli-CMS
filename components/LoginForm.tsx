"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/AdminIcon";
import { useAdminPreferences, type AdminLanguage } from "@/components/AdminPreferences";

export default function LoginForm() {
  const router = useRouter();
  const { language, setLanguage, t } = useAdminPreferences();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Sign in failed");
      return;
    }
    router.replace(data.user?.mustChangePassword ? "/change-password" : "/admin");
    router.refresh();
  }

  return (
    <div className="auth-shell">
      <section className="auth-intro">
        <div className="auth-brand"><span className="brand-emblem large-brand">TG</span><div><strong>Tabiat Gran</strong><span>{t("Content Management System")}</span></div></div>
        <div className="auth-intro-copy">
          <span className="eyebrow light-eyebrow">{t("Secure administration")}</span>
          <h1>{t("Manage your website from one professional workspace.")}</h1>
          <p>{t("Control projects, services, media, contact messages, multilingual content and website settings.")}</p>
        </div>
        <div className="auth-feature-list">
          <div><span><AdminIcon name="projects" size={16} /></span><p><strong>{t("Content management")}</strong><small>{t("Maintain published website information.")}</small></p></div>
          <div><span><AdminIcon name="media" size={16} /></span><p><strong>{t("Media library")}</strong><small>{t("Organize Cloudinary-backed assets.")}</small></p></div>
          <div><span><AdminIcon name="audit" size={16} /></span><p><strong>{t("Administrative control")}</strong><small>{t("Role-based access and audit history.")}</small></p></div>
        </div>
        <small className="auth-footnote">{t("Authorized administrators only")}</small>
      </section>

      <section className="auth-form-side">
        <form className="login-card" onSubmit={submit}>
          <div className="auth-mobile-brand"><span className="brand-emblem">TG</span><strong>Tabiat Gran CMS</strong></div>
          <div className="auth-card-top"><span className="eyebrow">{t("Administrator access")}</span><select className="auth-language-select" value={language} onChange={event => setLanguage(event.target.value as AdminLanguage)} aria-label={t("Language")}><option value="en">{t("English")}</option><option value="fa">{t("Dari")}</option><option value="ps">{t("Pashto")}</option></select></div>
          <h2>{t("Sign in to your account")}</h2>
          <p>{t("Enter your administrator credentials to continue.")}</p>
          <div className="field"><label>{t("Email address")}</label><input className="input auth-input" type="email" name="email" autoComplete="email" required placeholder="admin@example.com" /></div>
          <div className="field"><label>{t("Password")}</label><input className="input auth-input" type="password" name="password" autoComplete="current-password" required minLength={8} maxLength={72} placeholder={t("Enter your password")} /></div>
          {error ? <div className="alert alert-error auth-alert">{t(error)}</div> : null}
          <button className="btn btn-primary auth-submit" disabled={loading}>{loading ? t("Signing in…") : t("Sign in")}</button>
          <div className="auth-security"><AdminIcon name="audit" size={14} /><span>{t("Your session is protected by the existing CMS authentication system.")}</span></div>
        </form>
      </section>
    </div>
  );
}
