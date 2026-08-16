"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/AdminIcon";
import { useAdminPreferences } from "@/components/AdminPreferences";


function humanizeAuditValue(value: unknown) {
  const text = String(value || "").replaceAll("_", " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export default function AuditManager() {
  const { language, t } = useAdminPreferences();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/admin/audit", { cache: "no-store" }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load audit log"); setItems(data.items || []); }).catch(err => setError(err.message)); }, []);
  const locale = language === "fa" ? "fa-AF" : language === "ps" ? "ps-AF" : "en";
  return <>
    <div className="page-head"><div><span className="eyebrow">{t("Administration history")}</span><h1>{t("Audit Log")}</h1><p>{t("Review recorded administrative actions by user, resource, and date.")}</p></div><span className="page-counter"><AdminIcon name="audit" size={14} /> {items.length} {t("events")}</span></div>
    {error ? <div className="alert alert-error">{t(error)}</div> : null}
    <section className="panel audit-panel full-width-panel"><div className="panel-head compact-head"><div><h2>{t("Activity history")}</h2><p>{t("Most recent administrative events are shown first.")}</p></div></div><div className="table-wrap"><table className="table audit-table"><thead><tr><th>{t("Date")}</th><th>{t("Administrator")}</th><th>{t("Action")}</th><th>{t("Resource")}</th><th>{t("Record ID")}</th></tr></thead><tbody>{items.map(item => <tr key={item._id}><td><div className="date-cell"><AdminIcon name="clock" size={13} /><span>{new Date(item.createdAt).toLocaleString(locale)}</span></div></td><td><strong>{item.userName}</strong></td><td><span className="role-badge">{t(humanizeAuditValue(item.action))}</span></td><td><span className="resource-pill">{t(humanizeAuditValue(item.resource))}</span></td><td><code className="record-id">{item.resourceId || "—"}</code></td></tr>)}{!items.length ? <tr><td colSpan={5}><div className="empty-state compact">{t("No audit events yet.")}</div></td></tr> : null}</tbody></table></div></section>
  </>;
}
