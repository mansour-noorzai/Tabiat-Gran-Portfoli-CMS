"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/AdminIcon";
import AdminModal from "@/components/AdminModal";
import { useAdminPreferences } from "@/components/AdminPreferences";

type Message = Record<string, any>;
const statusOptions = [["all", "All messages"], ["new", "New"], ["in_progress", "In progress"], ["replied", "Replied"], ["archived", "Archived"], ["spam", "Spam"]] as const;

export default function MessagesManager() {
  const { language, t } = useAdminPreferences();
  const [items, setItems] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch(`/api/admin/messages?status=${status}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Unable to load messages"); return; }
    setItems(data.items || []);
  }
  useEffect(() => { void load(); }, [status]);

  async function update(payload: Record<string, unknown>) {
    if (!selected) return;
    const response = await fetch(`/api/admin/messages/${selected._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Update failed"); return; }
    setSelected(data.item); await load();
  }

  const locale = language === "fa" ? "fa-AF" : language === "ps" ? "ps-AF" : "en";

  return <>
    <div className="page-head"><div><span className="eyebrow">{t("Visitor communication")}</span><h1>{t("Contact Inbox")}</h1><p>{t("Review and manage messages submitted through the public website contact form.")}</p></div><span className="page-counter"><AdminIcon name="mail" size={14} /> {items.length} {t("messages")}</span></div>
    {error ? <div className="alert alert-error">{t(error)}</div> : null}
    <div className="panel inbox-toolbar"><div className="inbox-tabs" role="tablist" aria-label={t("Message status filter")}>{statusOptions.map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={status === value} className={status === value ? "active" : ""} onClick={() => setStatus(value)}>{t(label)}</button>)}</div></div>

    <section className="panel inbox-list-panel full-width-panel">
      <div className="panel-head compact-head"><div><h2>{t("Messages")}</h2><p>{t("Select a message to open its details.")}</p></div></div>
      <div className="message-list full-message-list">
        {items.map(message => <button key={message._id} className="message-item full-message-item" type="button" onClick={() => setSelected(structuredClone(message))}>
          <span className="message-avatar">{String(message.name || "?").trim().charAt(0).toUpperCase()}</span>
          <span className="message-main"><span className="message-line"><strong>{message.name}</strong><time>{new Date(message.createdAt).toLocaleDateString(locale)}</time></span><span className="message-subject">{message.subject || t("Website inquiry")}</span><span className="message-excerpt">{message.message}</span></span>
          <span className={`status-badge ${message.status}`}>{t(String(message.status).replaceAll("_", " ").replace(/^./, value => value.toUpperCase()))}</span>
        </button>)}
        {!items.length ? <div className="empty-state compact">{t("No messages found.")}</div> : null}
      </div>
    </section>

    <AdminModal open={Boolean(selected)} onClose={() => setSelected(null)} wide labelledBy="message-detail-title">
      {selected ? <>
        <div className="message-detail-head modal-editor-head"><div className="selected-message-title"><span className="message-avatar large">{String(selected.name || "?").trim().charAt(0).toUpperCase()}</span><div><span className="eyebrow">{t("Message details")}</span><h2 id="message-detail-title">{selected.name}</h2><p><bdi className="bidi-ltr" dir="ltr">{selected.email}</bdi>{selected.organization ? <><span aria-hidden="true"> · </span><span>{selected.organization}</span></> : null}</p></div></div><div className="row-actions"><a className="btn btn-primary btn-small" href={`mailto:${selected.email}`}><AdminIcon name="mail" size={13} /> {t("Reply by email")}</a><button className="icon-action modal-close" type="button" onClick={() => setSelected(null)} aria-label={t("Close")}>×</button></div></div>
        <div className="modal-editor-body message-modal-body"><div className="message-metadata"><div><span>{t("Subject")}</span><strong>{selected.subject || t("Website inquiry")}</strong></div><div><span>{t("Received")}</span><strong>{new Date(selected.createdAt).toLocaleString(locale)}</strong></div></div><div className="message-content"><p>{selected.message}</p></div><div className="message-admin-grid"><div className="field"><label>{t("Status")}</label><select className="select" value={selected.status} onChange={event => void update({ status: event.target.value })}><option value="new">{t("New")}</option><option value="in_progress">{t("In progress")}</option><option value="replied">{t("Replied")}</option><option value="archived">{t("Archived")}</option><option value="spam">{t("Spam")}</option></select></div><div className="field"><label>{t("Internal note")}</label><textarea className="textarea" value={selected.internalNote || ""} onChange={event => setSelected({ ...selected, internalNote: event.target.value })} placeholder={t("Add a private note for administrators…")} /></div></div></div>
        <div className="editor-footer modal-editor-footer"><button className="btn btn-primary" type="button" onClick={() => void update({ internalNote: selected.internalNote || "" })}><AdminIcon name="check" size={14} /> {t("Save note")}</button><button className="btn btn-secondary" type="button" onClick={() => setSelected(null)}>{t("Close")}</button></div>
      </> : null}
    </AdminModal>
  </>;
}
