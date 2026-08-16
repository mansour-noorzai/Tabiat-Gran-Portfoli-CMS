"use client";

import { useEffect, useMemo, useState } from "react";
import AdminIcon from "@/components/AdminIcon";
import AdminModal from "@/components/AdminModal";
import { useAdminPreferences } from "@/components/AdminPreferences";

type FieldType = "text" | "number" | "textarea" | "select" | "boolean" | "localized" | "localizedTextarea" | "localizedList" | "imageRef" | "imageList";

export type FieldDef = { key: string; label: string; type: FieldType; required?: boolean; options?: { value: string; label: string }[]; placeholder?: string };
export type ResourceConfig = { resource: string; title: string; description: string; fields: FieldDef[] };
type AnyItem = Record<string, any>;

const langs = [
  { key: "en", label: "English", dir: "ltr" },
  { key: "fa", label: "Dari", dir: "rtl" },
  { key: "ps", label: "Pashto", dir: "rtl" },
] as const;

function get(obj: AnyItem, path: string) { return path.split(".").reduce((value, key) => value?.[key], obj); }
function set(obj: AnyItem, path: string, value: any) {
  const copy = structuredClone(obj);
  const keys = path.split(".");
  let current = copy;
  keys.slice(0, -1).forEach(key => { current[key] ??= {}; current = current[key]; });
  current[keys.at(-1)!] = value;
  return copy;
}
function clean(item: AnyItem) { const value = structuredClone(item); ["_id", "__v", "createdAt", "updatedAt"].forEach(key => delete value[key]); return value; }
function emptyFrom(fields: FieldDef[]) {
  let item: AnyItem = {};
  for (const field of fields) {
    if (field.type === "boolean") item = set(item, field.key, true);
    else if (field.type.startsWith("localized")) item = set(item, field.key, field.type === "localizedList" ? [] : { en: "", fa: "", ps: "" });
    else if (field.type === "imageRef") item = set(item, field.key, { url: "", publicId: "" });
    else if (field.type === "imageList") item = set(item, field.key, []);
    else item = set(item, field.key, field.type === "number" ? 0 : "");
  }
  return item;
}
function statusOf(item: AnyItem) { if (item.status) return String(item.status); if (item.active !== undefined) return item.active ? "active" : "inactive"; return "record"; }
function scalarInputValue(value: unknown): string | number { return typeof value === "string" || typeof value === "number" ? value : ""; }

export default function ResourceManager({ config }: { config: ResourceConfig }) {
  const { language, t } = useAdminPreferences();
  const [items, setItems] = useState<AnyItem[]>([]);
  const [editing, setEditing] = useState<AnyItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  function nameOf(item: AnyItem) {
    const localizedKey = language === "fa" ? "fa" : language === "ps" ? "ps" : "en";
    return item.title?.[localizedKey] || item.name?.[localizedKey] || item.title?.en || item.name?.en || item.name || item.key || item.slug || item.quote?.[localizedKey]?.slice(0, 55) || item.quote?.en?.slice(0, 55) || t("Untitled record");
  }

  async function load() {
    setError("");
    const response = await fetch(`/api/admin/resources/${config.resource}?limit=100`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Unable to load data"); return; }
    setItems(data.items || []);
  }
  useEffect(() => { void load(); }, [config.resource]);

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(item => [nameOf(item), item.slug, item.type, item.donor, item.category].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [items, search, language]);

  function change(key: string, value: any) { setEditing(current => set(current || {}, key, value)); }

  async function save() {
    if (!editing) return;
    setBusy(true); setError(""); setNotice("");
    const id = editing._id;
    const response = await fetch(id ? `/api/admin/resources/${config.resource}/${id}` : `/api/admin/resources/${config.resource}`, {
      method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(clean(editing)),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) { setError(data.error || "Save failed"); return; }
    setNotice(t("Changes saved successfully."));
    setEditing(null);
    await load();
  }

  async function remove(item: AnyItem) {
    if (!confirm(`${t("Delete")} “${nameOf(item)}”?`)) return;
    const response = await fetch(`/api/admin/resources/${config.resource}/${item._id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Delete failed"); return; }
    await load();
  }

  const modalTitle = editing?._id ? `${t("Edit record")}: ${nameOf(editing)}` : `${t("Create record")}: ${t(config.title)}`;

  return (
    <>
      <div className="page-head">
        <div><span className="eyebrow">{t("Content module")}</span><h1>{t(config.title)}</h1><p>{t(config.description)}</p></div>
        <div className="page-actions"><button className="btn btn-primary" type="button" onClick={() => setEditing(emptyFrom(config.fields))}><AdminIcon name="plus" size={15} /> {t("Add new")}</button></div>
      </div>
      {error ? <div className="alert alert-error">{t(error)}</div> : null}
      {notice ? <div className="alert alert-success">{t(notice)}</div> : null}

      <div className="resource-toolbar panel full-width-toolbar">
        <div className="resource-count"><strong>{items.length}</strong><span>{t("Total records")}</span></div>
        <label className="table-search"><AdminIcon name="search" size={15} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`${t("Search")} ${t(config.title)}…`} /></label>
        <span className="results-label">{t("Showing")} {shown.length} {t("of")} {items.length}</span>
      </div>

      <section className="panel resource-list-panel full-width-panel">
        <div className="panel-head compact-head"><div><h2>{t(config.title)}</h2><p>{t("Select a record to edit its content.")}</p></div></div>
        <div className="table-wrap">
          <table className="table resource-table">
            <thead><tr><th>{t("Record")}</th><th>{t("Status")}</th><th>{t("Order")}</th><th>{t("Updated")}</th><th aria-label={t("Actions")} /></tr></thead>
            <tbody>
              {shown.map(item => {
                const status = statusOf(item);
                return <tr key={item._id}>
                  <td><button className="record-name" type="button" onClick={() => setEditing(structuredClone(item))}><span className="record-icon"><AdminIcon name="file" size={15} /></span><span><strong>{nameOf(item)}</strong><small>{item.slug || item.type || item.donor || item.category || t("Content record")}</small></span></button></td>
                  <td><span className={`status-badge ${status}`}>{t(status.replaceAll("_", " ").replace(/^./, value => value.toUpperCase()))}</span></td>
                  <td>{item.displayOrder ?? "—"}</td>
                  <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString(language === "fa" ? "fa-AF" : language === "ps" ? "ps-AF" : "en") : "—"}</td>
                  <td><div className="row-actions"><button className="icon-action" type="button" onClick={() => setEditing(structuredClone(item))} aria-label={`${t("Edit")} ${nameOf(item)}`}><AdminIcon name="edit" size={14} /></button><button className="icon-action danger" type="button" onClick={() => void remove(item)} aria-label={`${t("Delete")} ${nameOf(item)}`}><AdminIcon name="trash" size={14} /></button></div></td>
                </tr>;
              })}
              {!shown.length ? <tr><td colSpan={5}><div className="empty-state compact">{t("No records found.")}</div></td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <AdminModal open={Boolean(editing)} onClose={() => setEditing(null)} wide labelledBy="resource-editor-title">
        {editing ? <>
          <div className="editor-head modal-editor-head"><div><span className="eyebrow">{editing._id ? t("Edit record") : t("Create record")}</span><h2 id="resource-editor-title">{modalTitle}</h2><p>{t("Update the fields below. Multilingual values are stored separately.")}</p></div><button type="button" className="icon-action modal-close" onClick={() => setEditing(null)} aria-label={t("Close")}>×</button></div>
          <div className="editor-body modal-editor-body">{config.fields.map(field => <Field key={field.key} field={field} item={editing} onChange={change} />)}</div>
          <div className="editor-footer modal-editor-footer"><button className="btn btn-primary" disabled={busy} type="button" onClick={() => void save()}><AdminIcon name="check" size={14} /> {busy ? t("Saving…") : t("Save changes")}</button><button className="btn btn-secondary" type="button" onClick={() => setEditing(null)}>{t("Cancel")}</button></div>
        </> : null}
      </AdminModal>
    </>
  );
}

function Field({ field, item, onChange }: { field: FieldDef; item: AnyItem; onChange: (key: string, value: any) => void }) {
  const { t } = useAdminPreferences();
  const value = get(item, field.key);
  if (field.type === "boolean") return <label className="switch-card"><span><strong>{t(field.label)}</strong><small>{t("Enable or disable this option.")}</small></span><input type="checkbox" checked={Boolean(value)} onChange={event => onChange(field.key, event.target.checked)} /><i /></label>;

  if (field.type === "localized" || field.type === "localizedTextarea") return <div className="form-section"><div className="section-title"><h3>{t(field.label)}</h3><span>{t("Multilingual")}</span></div><div className="localized-grid">{langs.map(language => <div className="field" key={language.key}><label><span className="language-code">{language.key.toUpperCase()}</span>{t(language.label)}</label>{field.type === "localizedTextarea" ? <textarea dir={language.dir} className="textarea" value={value?.[language.key] || ""} onChange={event => onChange(field.key, { ...(value || {}), [language.key]: event.target.value })} /> : <input dir={language.dir} className="input" value={value?.[language.key] || ""} onChange={event => onChange(field.key, { ...(value || {}), [language.key]: event.target.value })} />}</div>)}</div></div>;

  if (field.type === "localizedList") return <div className="form-section"><div className="section-title"><h3>{t(field.label)}</h3><span>{t("One item per line")}</span></div><div className="localized-grid">{langs.map(language => {
    const text = (Array.isArray(value) ? value : []).map((entry: any) => entry?.[language.key] || "").join("\n");
    return <div className="field" key={language.key}><label><span className="language-code">{language.key.toUpperCase()}</span>{t(language.label)}</label><textarea dir={language.dir} className="textarea" value={text} onChange={event => { const lines = event.target.value.split("\n"); const old = Array.isArray(value) ? structuredClone(value) : []; const max = Math.max(old.length, lines.length); const next = Array.from({ length: max }, (_, index) => ({ ...old[index], [language.key]: lines[index] ?? "" })).filter(entry => Object.values(entry).some(Boolean)); onChange(field.key, next); }} /></div>;
  })}</div></div>;

  if (field.type === "imageRef") return <div className="field"><label>{t(field.label)}</label><input className="input" dir="ltr" placeholder={t("Cloudinary URL")} value={value?.url || ""} onChange={event => onChange(field.key, { ...(value || {}), url: event.target.value })} />{value?.url ? <div className="image-preview"><img alt={t("Selected media preview")} src={value.url} /></div> : null}</div>;
  if (field.type === "imageList") { const text = (Array.isArray(value) ? value : []).map((entry: any) => entry.url || "").join("\n"); return <div className="field"><label>{t(field.label)}</label><textarea className="textarea" dir="ltr" placeholder={t("One Cloudinary URL per line")} value={text} onChange={event => onChange(field.key, event.target.value.split("\n").map(url => url.trim()).filter(Boolean).map(url => ({ url, publicId: "" })))} /></div>; }

  const ltrValue = field.type === "number" || /(?:slug|url|key|phone|email|year)/i.test(`${field.key} ${field.label}`);
  const scalarValue = scalarInputValue(value);
  return <div className="field"><label>{t(field.label)}{field.required ? <span className="required">*</span> : null}</label>{field.type === "textarea" ? <textarea className="textarea" required={field.required} value={scalarValue} onChange={event => onChange(field.key, event.target.value)} placeholder={field.placeholder ? t(field.placeholder) : undefined} /> : field.type === "select" ? <select className="select" value={scalarValue} onChange={event => onChange(field.key, event.target.value)}><option value="">{t("Select…")}</option>{field.options?.map(option => <option key={option.value} value={option.value}>{t(option.label)}</option>)}</select> : <input className={`input ${ltrValue ? "bidi-ltr" : ""}`} dir={ltrValue ? "ltr" : undefined} type={field.type === "number" ? "number" : "text"} required={field.required} value={scalarValue} onChange={event => onChange(field.key, field.type === "number" ? Number(event.target.value) : event.target.value)} placeholder={field.placeholder ? t(field.placeholder) : undefined} />}</div>;
}
