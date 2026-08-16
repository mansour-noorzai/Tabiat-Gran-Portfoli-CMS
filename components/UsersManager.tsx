"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/AdminIcon";
import AdminModal from "@/components/AdminModal";
import { useAdminPreferences } from "@/components/AdminPreferences";

type User = { _id?: string; name: string; email: string; role: string; isActive: boolean; mustChangePassword: boolean; lastLoginAt?: string; password?: string };
const blank: User = { name: "", email: "", role: "editor", isActive: true, mustChangePassword: true, password: "" };

export default function UsersManager() {
  const { language, t } = useAdminPreferences();
  const [items, setItems] = useState<User[]>([]);
  const [editing, setEditing] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Unable to load users"); return; }
    setItems(data.items || []);
  }
  useEffect(() => { void load(); }, []);

  async function save() {
    if (!editing) return;
    setBusy(true); setError("");
    const body = { ...editing };
    if (editing._id && !body.password) delete body.password;
    const response = await fetch(editing._id ? `/api/admin/users/${editing._id}` : "/api/admin/users", { method: editing._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) { setError(data.error || "Save failed"); return; }
    setEditing(null); await load();
  }

  async function remove(user: User) {
    if (!user._id || !confirm(`${t("Delete")} ${user.name}?`)) return;
    const response = await fetch(`/api/admin/users/${user._id}`, { method: "DELETE" });
    if (!response.ok) { setError((await response.json()).error || "Delete failed"); return; }
    await load();
  }

  return <>
    <div className="page-head"><div><span className="eyebrow">{t("Access management")}</span><h1>{t("Users & Roles")}</h1><p>{t("Create CMS administrators and editors, manage roles, and control account access.")}</p></div><button className="btn btn-primary" type="button" onClick={() => setEditing({ ...blank })}><AdminIcon name="plus" size={15} /> {t("Add user")}</button></div>
    {error ? <div className="alert alert-error">{t(error)}</div> : null}

    <div className="user-summary-grid"><div className="mini-stat"><span className="mini-stat-icon blue"><AdminIcon name="users" size={17} /></span><div><strong>{items.length}</strong><span>{t("Total users")}</span></div></div><div className="mini-stat"><span className="mini-stat-icon green"><AdminIcon name="check" size={17} /></span><div><strong>{items.filter(user => user.isActive).length}</strong><span>{t("Active accounts")}</span></div></div><div className="mini-stat"><span className="mini-stat-icon violet"><AdminIcon name="audit" size={17} /></span><div><strong>{items.filter(user => user.role === "super_admin" || user.role === "admin").length}</strong><span>{t("Administrators")}</span></div></div></div>

    <section className="panel resource-list-panel full-width-panel">
      <div className="panel-head compact-head"><div><h2>{t("CMS users")}</h2><p>{t("Accounts with access to administration.")}</p></div></div>
      <div className="table-wrap"><table className="table user-table"><thead><tr><th>{t("User")}</th><th>{t("Role")}</th><th>{t("Status")}</th><th>{t("Last login")}</th><th aria-label={t("Actions")} /></tr></thead><tbody>
        {items.map(user => { const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "U"; return <tr key={user._id}><td><button className="user-cell" type="button" onClick={() => setEditing({ ...user, password: "" })}><span className="avatar table-avatar">{initials}</span><span><strong>{user.name}</strong><small className="bidi-ltr" dir="ltr">{user.email}</small></span></button></td><td><span className="role-badge">{t(user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Content Editor")}</span></td><td><span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>{t(user.isActive ? "Active" : "Disabled")}</span></td><td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString(language === "fa" ? "fa-AF" : language === "ps" ? "ps-AF" : "en") : t("Never")}</td><td><div className="row-actions"><button className="icon-action" type="button" onClick={() => setEditing({ ...user, password: "" })} aria-label={`${t("Edit")} ${user.name}`}><AdminIcon name="edit" size={14} /></button><button className="icon-action danger" type="button" onClick={() => void remove(user)} aria-label={`${t("Delete")} ${user.name}`}><AdminIcon name="trash" size={14} /></button></div></td></tr>; })}
        {!items.length ? <tr><td colSpan={5}><div className="empty-state compact">{t("No users found.")}</div></td></tr> : null}
      </tbody></table></div>
    </section>

    <AdminModal open={Boolean(editing)} onClose={() => setEditing(null)} labelledBy="user-editor-title">
      {editing ? <><div className="editor-head modal-editor-head"><div><span className="eyebrow">{t(editing._id ? "Account settings" : "Create account")}</span><h2 id="user-editor-title">{editing._id ? editing.name : t("Create account")}</h2><p>{t("Configure identity, credentials and CMS role.")}</p></div><button className="icon-action modal-close" type="button" onClick={() => setEditing(null)} aria-label={t("Close")}>×</button></div>
        <div className="editor-body modal-editor-body"><div className="field"><label>{t("Name")}<span className="required">*</span></label><input className="input" value={editing.name} onChange={event => setEditing({ ...editing, name: event.target.value })} /></div><div className="field"><label>{t("Email")}<span className="required">*</span></label><input className="input bidi-ltr" dir="ltr" type="email" value={editing.email} onChange={event => setEditing({ ...editing, email: event.target.value })} /></div><div className="field"><label>{t(editing._id ? "New password (optional)" : "Temporary password")}</label><input className="input" type="password" minLength={10} value={editing.password || ""} onChange={event => setEditing({ ...editing, password: event.target.value })} /></div><div className="field"><label>{t("Role")}</label><select className="select" value={editing.role} onChange={event => setEditing({ ...editing, role: event.target.value })}><option value="editor">{t("Content Editor")}</option><option value="admin">{t("Admin")}</option><option value="super_admin">{t("Super Admin")}</option></select></div><div className="form-section"><div className="section-title"><h3>{t("Account settings")}</h3></div><label className="switch-card"><span><strong>{t("Active account")}</strong><small>{t("Allow this user to sign in.")}</small></span><input type="checkbox" checked={editing.isActive} onChange={event => setEditing({ ...editing, isActive: event.target.checked })} /><i /></label><label className="switch-card"><span><strong>{t("Require password change")}</strong><small>{t("Prompt the user to set a new password on next sign-in.")}</small></span><input type="checkbox" checked={editing.mustChangePassword} onChange={event => setEditing({ ...editing, mustChangePassword: event.target.checked })} /><i /></label></div></div>
        <div className="editor-footer modal-editor-footer"><button className="btn btn-primary" disabled={busy} type="button" onClick={() => void save()}><AdminIcon name="check" size={14} />{busy ? t("Saving…") : t("Save user")}</button><button className="btn btn-secondary" type="button" onClick={() => setEditing(null)}>{t("Cancel")}</button></div></> : null}
    </AdminModal>
  </>;
}
