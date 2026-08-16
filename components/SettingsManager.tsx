"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/AdminIcon";
import { useAdminPreferences } from "@/components/AdminPreferences";

type Obj = Record<string, any>;
type SectionKey = "company" | "homepage" | "navigation" | "footer" | "seo";

const languages = [
  ["en", "English", "ltr"],
  ["fa", "Dari", "rtl"],
  ["ps", "Pashto", "rtl"],
] as const;

const sections: { key: SectionKey; label: string; helper: string; icon: "settings" | "dashboard" | "menu" | "file" | "search" }[] = [
  { key: "company", label: "Company", helper: "Identity and contact information", icon: "settings" },
  { key: "homepage", label: "Homepage", helper: "Hero and about content", icon: "dashboard" },
  { key: "navigation", label: "Navigation", helper: "Menu labels", icon: "menu" },
  { key: "footer", label: "Footer", helper: "Footer content and labels", icon: "file" },
  { key: "seo", label: "SEO", helper: "Search and social metadata", icon: "search" },
];

function get(obj: Obj, path: string) {
  return path.split(".").reduce((value, key) => value?.[key], obj);
}

function scalarInputValue(value: unknown): string | number {
  return typeof value === "string" || typeof value === "number" ? value : "";
}

function set(obj: Obj, path: string, value: any) {
  const copy = structuredClone(obj || {});
  const keys = path.split(".");
  let current = copy;
  for (const key of keys.slice(0, -1)) {
    current[key] ??= {};
    current = current[key];
  }
  current[keys.at(-1)!] = value;
  return copy;
}

function LocalizedField({ label, path, data, onChange, area = false }: { label: string; path: string; data: Obj; onChange: (path: string, value: any) => void; area?: boolean }) {
  const { t } = useAdminPreferences();
  const value = get(data, path) || {};
  return (
    <div className="form-section">
      <div className="section-title"><h3>{t(label)}</h3><span>{t("Multilingual")}</span></div>
      <div className="localized-grid">
        {languages.map(([key, name, direction]) => (
          <div className="field" key={key}>
            <label><span className="language-code">{key.toUpperCase()}</span>{t(name)}</label>
            {area ? (
              <textarea className="textarea" dir={direction} value={value[key] || ""} onChange={event => onChange(path, { ...value, [key]: event.target.value })} />
            ) : (
              <input className="input" dir={direction} value={value[key] || ""} onChange={event => onChange(path, { ...value, [key]: event.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TextField({ label, path, data, onChange, type = "text", help }: { label: string; path: string; data: Obj; onChange: (path: string, value: any) => void; type?: string; help?: string }) {
  const { t } = useAdminPreferences();
  const ltrValue = type === "email" || /(?:url|phone|registrationnumber|year|keywords)/i.test(path);
  return (
    <div className="field">
      <label>{t(label)}</label>
      <input className={`input ${ltrValue ? "bidi-ltr" : ""}`} dir={ltrValue ? "ltr" : undefined} type={type} value={scalarInputValue(get(data, path))} onChange={event => onChange(path, event.target.value)} />
      {help ? <small className="form-help">{t(help)}</small> : null}
    </div>
  );
}

export default function SettingsManager() {
  const { t } = useAdminPreferences();
  const [data, setData] = useState<Obj>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<SectionKey>("company");

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(async response => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load settings");
        setData(payload.item || {});
      })
      .catch(err => setError(err.message));
  }, []);

  function change(path: string, value: any) {
    setNotice("");
    setData(current => set(current, path, value));
  }

  async function save() {
    setBusy(true);
    setError("");
    setNotice("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(payload.error || "Save failed");
      return;
    }
    setData(payload.item);
    setNotice("Settings saved successfully.");
  }

  return (
    <>
      <div className="page-head">
        <div><span className="eyebrow">{t("Website configuration")}</span><h1>{t("Site Settings")}</h1><p>{t("Manage company details, homepage content, navigation, footer information and SEO.")}</p></div>
        <button className="btn btn-primary" disabled={busy} type="button" onClick={() => void save()}><AdminIcon name="check" size={14} />{busy ? t("Saving…") : t("Save all settings")}</button>
      </div>

      {error ? <div className="alert alert-error">{t(error)}</div> : null}
      {notice ? <div className="alert alert-success">{t(notice)}</div> : null}

      <div className="settings-layout">
        <aside className="panel settings-sidebar">
          <div className="settings-sidebar-head"><strong>{t("Settings")}</strong><span>{t("Website configuration")}</span></div>
          <nav aria-label={t("Settings sections")}>
            {sections.map(item => (
              <button type="button" key={item.key} className={section === item.key ? "active" : ""} onClick={() => setSection(item.key)}>
                <span className="settings-nav-icon"><AdminIcon name={item.icon} size={16} /></span>
                <span><strong>{t(item.label)}</strong><small>{t(item.helper)}</small></span>
                <AdminIcon name="chevron" size={12} />
              </button>
            ))}
          </nav>
        </aside>

        <section className="panel settings-content">
          {section === "company" ? (
            <>
              <SettingsHeading title="Company information" description="Core identity, contact details, branding and office information." />
              <div className="settings-body">
                <LocalizedField label="Company name" path="company.name" data={data} onChange={change} />
                <LocalizedField label="Short name" path="company.shortName" data={data} onChange={change} />
                <LocalizedField label="Tagline" path="company.tagline" data={data} onChange={change} />
                <div className="settings-grid">
                  <TextField label="Established year" path="company.establishedYear" data={data} onChange={change} />
                  <TextField label="Registration number" path="company.registrationNumber" data={data} onChange={change} />
                  <TextField label="Primary phone" path="company.phonePrimary" data={data} onChange={change} />
                  <TextField label="Secondary phone" path="company.phoneSecondary" data={data} onChange={change} />
                  <TextField label="General email" path="company.emailGeneral" data={data} onChange={change} type="email" />
                  <TextField label="Tender email" path="company.emailTenders" data={data} onChange={change} type="email" />
                  <TextField label="Logo Cloudinary URL" path="company.logo.url" data={data} onChange={change} help="Use an asset URL from the Media Library." />
                  <TextField label="Favicon Cloudinary URL" path="company.favicon.url" data={data} onChange={change} help="Use a square icon asset where possible." />
                </div>
                <LocalizedField label="Office address" path="company.address" data={data} onChange={change} />
                <LocalizedField label="Working hours" path="company.workingHours" data={data} onChange={change} />
                <LocalizedField label="Provincial offices" path="company.provincialOffices" data={data} onChange={change} />
              </div>
            </>
          ) : null}

          {section === "homepage" ? (
            <>
              <SettingsHeading title="Homepage content" description="Edit the hero and about sections shown on the public homepage." />
              <div className="settings-body">
                <div className="settings-subsection"><div className="settings-subsection-title"><span className="subsection-icon"><AdminIcon name="dashboard" size={16} /></span><div><h3>{t("Hero section")}</h3><p>{t("Main homepage introduction and calls to action.")}</p></div></div>
                  <LocalizedField label="Badge" path="homepage.hero.badge" data={data} onChange={change} />
                  <LocalizedField label="Title line 1" path="homepage.hero.title1" data={data} onChange={change} />
                  <LocalizedField label="Highlighted title" path="homepage.hero.title2" data={data} onChange={change} />
                  <LocalizedField label="Subtitle" path="homepage.hero.subtitle" data={data} onChange={change} area />
                  <LocalizedField label="Primary CTA" path="homepage.hero.cta1" data={data} onChange={change} />
                  <LocalizedField label="Secondary CTA" path="homepage.hero.cta2" data={data} onChange={change} />
                  <TextField label="Hero image Cloudinary URL" path="homepage.hero.image.url" data={data} onChange={change} help="Paste the URL of the selected hero image from Media Library." />
                </div>
                <div className="settings-subsection"><div className="settings-subsection-title"><span className="subsection-icon"><AdminIcon name="file" size={16} /></span><div><h3>{t("About section")}</h3><p>{t("Homepage organization introduction and imagery.")}</p></div></div>
                  <LocalizedField label="Kicker" path="homepage.about.kicker" data={data} onChange={change} />
                  <LocalizedField label="Italic prefix" path="homepage.about.titlePrefix" data={data} onChange={change} />
                  <LocalizedField label="Title" path="homepage.about.title" data={data} onChange={change} />
                  <LocalizedField label="Paragraph 1" path="homepage.about.paragraph1" data={data} onChange={change} area />
                  <LocalizedField label="Paragraph 2" path="homepage.about.paragraph2" data={data} onChange={change} area />
                  <div className="settings-grid"><TextField label="About image 1 URL" path="homepage.about.image1.url" data={data} onChange={change} /><TextField label="About image 2 URL" path="homepage.about.image2.url" data={data} onChange={change} /></div>
                </div>
              </div>
            </>
          ) : null}

          {section === "navigation" ? (
            <>
              <SettingsHeading title="Navigation labels" description="Control public website menu labels in English, Dari and Pashto." />
              <div className="settings-body">
                {[["home", "Home"], ["about", "About"], ["services", "Services"], ["projects", "Projects"], ["partners", "Partners"], ["contact", "Contact"], ["quote", "Request CTA"]].map(([key, label]) => (
                  <LocalizedField key={key} label={label} path={`navigation.labels.${key}`} data={data} onChange={change} />
                ))}
              </div>
            </>
          ) : null}

          {section === "footer" ? (
            <>
              <SettingsHeading title="Footer content" description="Edit organization information and footer labels displayed across the public website." />
              <div className="settings-body">
                <LocalizedField label="About text" path="footer.about" data={data} onChange={change} area />
                <LocalizedField label="Registration text" path="footer.registrationText" data={data} onChange={change} />
                <LocalizedField label="Quick links heading" path="footer.linksLabel" data={data} onChange={change} />
                <LocalizedField label="Services heading" path="footer.servicesLabel" data={data} onChange={change} />
                <LocalizedField label="Contact heading" path="footer.contactLabel" data={data} onChange={change} />
                <LocalizedField label="Rights text" path="footer.rights" data={data} onChange={change} />
              </div>
            </>
          ) : null}

          {section === "seo" ? (
            <>
              <SettingsHeading title="SEO & social sharing" description="Manage metadata used by search engines and social platforms." />
              <div className="settings-body">
                <LocalizedField label="Meta title" path="seo.title" data={data} onChange={change} />
                <LocalizedField label="Meta description" path="seo.description" data={data} onChange={change} area />
                <TextField label="Keywords" path="seo.keywords" data={data} onChange={change} help="Keep the current format expected by the backend settings model." />
                <TextField label="Open Graph image URL" path="seo.ogImage.url" data={data} onChange={change} help="Used when the website is shared on social platforms." />
              </div>
            </>
          ) : null}

          <div className="settings-savebar"><span>{t("Changes are saved only when you click the button.")}</span><button className="btn btn-primary" disabled={busy} type="button" onClick={() => void save()}><AdminIcon name="check" size={14} />{busy ? t("Saving…") : t("Save settings")}</button></div>
        </section>
      </div>
    </>
  );
}

function SettingsHeading({ title, description }: { title: string; description: string }) {
  const { t } = useAdminPreferences();
  return <div className="settings-content-head"><div><span className="eyebrow">{t("Site settings")}</span><h2>{t(title)}</h2><p>{t(description)}</p></div></div>;
}
