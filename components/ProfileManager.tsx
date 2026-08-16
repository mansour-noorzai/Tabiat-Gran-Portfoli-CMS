"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/AdminIcon";
import { DEFAULT_ACCENT, useAdminPreferences, type AdminLanguage, type AdminThemeMode } from "@/components/AdminPreferences";

type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  mustChangePassword: boolean;
  avatarUrl: string;
  avatarPublicId: string;
  preferredLanguage: AdminLanguage;
  themeMode: AdminThemeMode;
  themeColor: string;
};

const accentPresets = ["#696cff", "#7367f0", "#2563eb", "#00a6c7", "#28a745", "#f59e0b", "#e04f5f"];

export default function ProfileManager() {
  const router = useRouter();
  const preferences = useAdminPreferences();
  const { t } = preferences;
  const [session, setSession] = useState<SessionUser | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPublicId, setAvatarPublicId] = useState("");
  const [language, setLanguage] = useState<AdminLanguage>("en");
  const [themeMode, setThemeMode] = useState<AdminThemeMode>("light");
  const [themeColor, setThemeColor] = useState(DEFAULT_ACCENT);
  const [profileBusy, setProfileBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load profile");
        if (cancelled) return;
        const current = data.user as SessionUser;
        setSession(current);
        setName(current.name || "");
        setAvatarUrl(current.avatarUrl || "");
        setAvatarPublicId(current.avatarPublicId || "");
        // Language/theme are controlled by the shared AdminPreferences provider.
        // Do not overwrite a navbar change when the profile screen opens.
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load profile");
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setLanguage(preferences.language);
    setThemeMode(preferences.themeMode);
    setThemeColor(preferences.themeColor);
  }, [preferences.language, preferences.themeMode, preferences.themeColor]);

  const initials = useMemo(() => (name || session?.name || "Admin")
    .split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "AD", [name, session?.name]);

  function previewPreferences(next: { language?: AdminLanguage; themeMode?: AdminThemeMode; themeColor?: string }) {
    const nextLanguage = next.language ?? language;
    const nextTheme = next.themeMode ?? themeMode;
    const nextColor = next.themeColor ?? themeColor;
    setLanguage(nextLanguage);
    setThemeMode(nextTheme);
    setThemeColor(nextColor);
    preferences.applyUserPreferences({ language: nextLanguage, themeMode: nextTheme, themeColor: nextColor });
  }

  async function uploadAvatar() {
    if (!avatarFile) return;
    const body = new FormData();
    body.append("file", avatarFile);
    setUploadBusy(true);
    setError("");
    setSuccess("");
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const data = await response.json();
    setUploadBusy(false);
    if (!response.ok) {
      setError(data.error || "Profile image upload failed");
      return;
    }
    const uploaded = data.item;
    setAvatarUrl(uploaded.secureUrl || uploaded.url || "");
    setAvatarPublicId(uploaded.publicId || "");
    setAvatarFile(null);
    setSuccess(t("Profile photo uploaded. Save your profile to use it for your account."));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileBusy(true);
    setError("");
    setSuccess("");
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        avatar: { url: avatarUrl.trim(), publicId: avatarPublicId.trim() },
        preferences: { language, themeMode, themeColor },
      }),
    });
    const data = await response.json();
    setProfileBusy(false);
    if (!response.ok) {
      setError(data.error || "Unable to update profile");
      return;
    }
    setName(data.item?.name || name);
    setAvatarUrl(data.item?.avatar?.url || avatarUrl);
    setAvatarPublicId(data.item?.avatar?.publicId || avatarPublicId);
    preferences.applyUserPreferences(data.item?.preferences || { language, themeMode, themeColor });
    setSuccess(t("Profile details updated successfully."));
    router.refresh();
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (newPassword !== confirmPassword) {
      setError(t("New passwords do not match."));
      setSuccess("");
      return;
    }
    setPasswordBusy(true);
    setError("");
    setSuccess("");
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    setPasswordBusy(false);
    if (!response.ok) {
      setError(data.error || "Unable to change password");
      return;
    }
    formElement.reset();
    setSuccess(t("Password changed successfully."));
    router.refresh();
  }

  return (
    <>
      <div className="page-head sneat-page-head">
        <div><span className="eyebrow">{t("Account settings")}</span><h1>{t("My Profile")}</h1><p>{t("Your identity used throughout the administration panel.")}</p></div>
      </div>

      {error ? <div className="alert alert-error">{t(error)}</div> : null}
      {success ? <div className="alert alert-success">{t(success)}</div> : null}

      <div className="profile-settings-grid">
        <section className="panel profile-overview-card">
          <div className="profile-cover" />
          <div className="profile-overview-body">
            <span className={`profile-avatar-xl ${avatarUrl ? "has-image" : ""}`}>{avatarUrl ? <img src={avatarUrl} alt={name || "Profile"} /> : initials}</span>
            <div className="profile-title-block"><h2>{name || session?.name || t("Administrator")}</h2><p className="bidi-ltr" dir="ltr">{session?.email || ""}</p><span className="role-badge profile-main-role">{session?.role ? t(session.role === "super_admin" ? "Super Admin" : session.role === "admin" ? "Admin" : "Content Editor") : ""}</span></div>
          </div>
          <div className="profile-facts">
            <div><span>{t("Account")}</span><strong>{t("Active")}</strong></div>
            <div><span>{t("Language")}</span><strong>{t(language === "fa" ? "Dari" : language === "ps" ? "Pashto" : "English")}</strong></div>
            <div><span>{t("Security")}</span><strong>{session?.mustChangePassword ? t("Action required") : t("Protected")}</strong></div>
          </div>
        </section>

        <section className="panel profile-account-card">
          <div className="panel-head"><div><h2>{t("Account details")}</h2><p>{t("Your identity used throughout the administration panel.")}</p></div><span className="profile-section-icon"><AdminIcon name="users" size={20} /></span></div>
          <form className="profile-form" onSubmit={saveProfile}>
            <div className="profile-photo-row">
              <div className={`profile-photo-preview ${avatarUrl ? "has-image" : ""}`}>{avatarUrl ? <img src={avatarUrl} alt={name || "Profile"} /> : initials}</div>
              <div className="profile-photo-controls">
                <strong>{t("Profile photo")}</strong>
                <p>{t("Upload an image to Cloudinary through the existing Media Library API, or paste an existing secure Cloudinary URL below.")}</p>
                <div className="profile-inline-upload">
                  <label className="file-picker"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={event => setAvatarFile(event.target.files?.[0] || null)} /><span>{avatarFile?.name || t("Choose file")}</span></label>
                  <button className="btn btn-secondary" disabled={uploadBusy || !avatarFile} type="button" onClick={() => void uploadAvatar()}><AdminIcon name="upload" size={14} />{uploadBusy ? t("Uploading…") : t("Upload profile photo")}</button>
                </div>
              </div>
            </div>

            <div className="profile-form-grid two-column">
              <div className="field"><label>{t("Full name")}</label><input className="input" value={name} onChange={event => setName(event.target.value)} minLength={2} maxLength={100} required /></div>
              <div className="field"><label>{t("Email")}</label><input className="input bidi-ltr" dir="ltr" type="email" value={session?.email || ""} disabled /><small className="form-help">{t("Email changes remain controlled by Users & Roles.")}</small></div>
            </div>
            <div className="field"><label>{t("Profile image Cloudinary URL")}</label><input className="input mono-input" dir="ltr" value={avatarUrl} onChange={event => { setAvatarUrl(event.target.value); if (event.target.value !== avatarUrl) setAvatarPublicId(""); }} placeholder="https://res.cloudinary.com/..." /><small className="form-help">{t("You can paste a Cloudinary HTTPS image URL directly.")}</small></div>

            <div className="appearance-section">
              <div className="section-title"><h3>{t("Appearance & language")}</h3><span>{t("Theme color")}</span></div>
              <p className="form-help">{t("Choose the CMS language, display mode and primary color for your account.")}</p>
              <div className="profile-form-grid three-column">
                <div className="field"><label>{t("Language")}</label><select className="select" value={language} onChange={event => previewPreferences({ language: event.target.value as AdminLanguage })}><option value="en">{t("English")}</option><option value="fa">{t("Dari")}</option><option value="ps">{t("Pashto")}</option></select></div>
                <div className="field"><label>{t("Display mode")}</label><select className="select" value={themeMode} onChange={event => previewPreferences({ themeMode: event.target.value as AdminThemeMode })}><option value="light">{t("Light")}</option><option value="dark">{t("Dark")}</option><option value="system">{t("System")}</option></select></div>
                <div className="field"><label>{t("Custom color")}</label><div className="color-input-wrap"><input type="color" value={themeColor} onChange={event => previewPreferences({ themeColor: event.target.value })} /><input className="input mono-input" dir="ltr" value={themeColor} readOnly aria-label={t("Theme color hex value")} /></div></div>
              </div>
              <div className="accent-presets" aria-label={t("Primary color")}>{accentPresets.map(color => <button key={color} type="button" className={themeColor.toLowerCase() === color.toLowerCase() ? "active" : ""} style={{ backgroundColor: color }} onClick={() => previewPreferences({ themeColor: color })} aria-label={color} />)}</div>
            </div>

            <div className="profile-form-actions"><button className="btn btn-primary" disabled={profileBusy} type="submit"><AdminIcon name="check" size={14} />{profileBusy ? t("Saving…") : t("Save profile")}</button></div>
          </form>
        </section>

        <section className="panel profile-security-card">
          <div className="panel-head"><div><h2>{t("Password & security")}</h2><p>{t("Change your password without affecting your profile preferences.")}</p></div><span className="profile-section-icon"><AdminIcon name="audit" size={20} /></span></div>
          <form className="profile-form" onSubmit={changePassword}>
            <div className="field"><label>{t("Current password")}</label><input className="input" type="password" name="currentPassword" autoComplete="current-password" required /></div>
            <div className="profile-form-grid two-column"><div className="field"><label>{t("New password")}</label><input className="input" type="password" name="newPassword" minLength={10} autoComplete="new-password" required /></div><div className="field"><label>{t("Confirm new password")}</label><input className="input" type="password" name="confirmPassword" minLength={10} autoComplete="new-password" required /></div></div>
            <div className="profile-form-actions"><button className="btn btn-primary" disabled={passwordBusy} type="submit">{passwordBusy ? t("Updating…") : t("Change password")}</button></div>
          </form>
        </section>
      </div>
    </>
  );
}
