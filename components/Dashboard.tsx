"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import AdminIcon, { type AdminIconName } from "@/components/AdminIcon";
import { useAdminPreferences } from "@/components/AdminPreferences";

type Data = { counts: Record<string, number>; recent: Record<string, any>[] };
type Viewer = { name: string; role: string } | null;

type Metric = {
  label: string;
  value: number;
  helper: string;
  icon: AdminIconName;
  tone: "blue" | "green" | "amber" | "violet";
  href: string;
};

function humanizeAuditValue(value: unknown) {
  const text = String(value || "").replaceAll("_", " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export default function Dashboard() {
  const { language, t } = useAdminPreferences();
  const [data, setData] = useState<Data | null>(null);
  const [viewer, setViewer] = useState<Viewer>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then(async response => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load dashboard");
        setData(payload);
      })
      .catch(err => setError(err.message));

    fetch("/api/auth/me", { cache: "no-store" })
      .then(response => response.json())
      .then(payload => setViewer(payload.user ? { name: payload.user.name, role: payload.user.role } : null))
      .catch(() => undefined);
  }, []);

  const counts = data?.counts || {};
  const projects = counts.projects || 0;
  const published = counts.publishedProjects || 0;
  const publicationPct = projects ? Math.round((published / projects) * 100) : 0;
  const draftProjects = Math.max(projects - published, 0);

  const metrics = useMemo<Metric[]>(() => [
    { label: "Projects", value: projects, helper: `${published} ${t("published")}`, icon: "projects", tone: "blue", href: "/admin/projects" },
    { label: "Services", value: counts.services || 0, helper: t("Website services"), icon: "services", tone: "green", href: "/admin/services" },
    { label: "Partners", value: counts.partners || 0, helper: t("Partner records"), icon: "partners", tone: "amber", href: "/admin/partners" },
    { label: "Media", value: counts.media || 0, helper: t("Stored assets"), icon: "media", tone: "violet", href: "/admin/media" },
  ], [counts.media, counts.partners, counts.services, projects, published, t]);

  const distribution = [
    { label: "Projects", value: projects },
    { label: "Services", value: counts.services || 0 },
    { label: "Partners", value: counts.partners || 0 },
    { label: "Media", value: counts.media || 0 },
    { label: "Users", value: counts.users || 0 },
  ];
  const maxValue = Math.max(1, ...distribution.map(item => item.value));

  return (
    <>
      <div className="page-head sneat-page-head dashboard-page-head">
        <div>
          <span className="eyebrow">CMS</span>
          <h1>{t("Dashboard")}</h1>
          <p>{t("Monitor content and access the most important administration workflows.")}</p>
        </div>
        <div className="page-actions">
          <Link className="btn btn-secondary" href="/admin/media"><AdminIcon name="media" size={15} /> {t("Media Library")}</Link>
          <Link className="btn btn-primary" href="/admin/projects"><AdminIcon name="plus" size={15} /> {t("Add new")} {t("Projects")}</Link>
        </div>
      </div>

      {error ? <div className="alert alert-error">{t(error)}</div> : null}

      <section className="dashboard-welcome-grid">
        <article className="panel dashboard-welcome-card">
          <div className="dashboard-welcome-copy">
            <span className="dashboard-kicker">{t("Welcome back")}</span>
            <h2>{viewer?.name || t("Administrator")} 👋</h2>
            <p>{t("Your website administration workspace is ready. Review publishing progress, media, messages and recent activity from here.")}</p>
            <Link className="btn btn-primary btn-small" href="/admin/profile"> {t("My Profile")}</Link>
          </div>
          <div className="dashboard-welcome-art" aria-hidden="true">
            <span className="art-card art-card-one"><AdminIcon name="projects" size={22} /></span>
            <span className="art-card art-card-two"><AdminIcon name="chart" size={22} /></span>
            <span className="art-orbit" />
            <span className="art-person">TG</span>
          </div>
        </article>

        <article className="panel dashboard-mini-card">
          <span className="metric-icon blue"><AdminIcon name="mail" size={19} /></span>
          <span>{t("New")} {t("messages")}</span>
          <strong>{data ? counts.newMessages || 0 : "—"}</strong>
          <small>{t("Contact form inbox")}</small>
          <Link href="/admin/messages">{t("Open inbox")} <AdminIcon name="chevron" size={11} /></Link>
        </article>

        <article className="panel dashboard-mini-card">
          <span className="metric-icon green"><AdminIcon name="check" size={19} /></span>
          <span>{t("Published")}</span>
          <strong>{data ? `${publicationPct}%` : "—"}</strong>
          <small>{published} {t("of")} {projects} {t("Projects").toLowerCase()}</small>
          <Link href="/admin/projects">{t("Review content")} <AdminIcon name="chevron" size={11} /></Link>
        </article>
      </section>

      <section className="metric-grid sneat-metric-grid" aria-label={t("CMS summary")}>
        {metrics.map(metric => (
          <Link className="metric-card" href={metric.href} key={metric.label}>
            <div className={`metric-icon ${metric.tone}`}><AdminIcon name={metric.icon} size={20} /></div>
            <div className="metric-body">
              <span>{t(metric.label)}</span>
              <strong>{data ? metric.value : "—"}</strong>
              <small>{metric.helper}</small>
            </div>
            <AdminIcon className="metric-arrow" name="chevron" size={15} />
          </Link>
        ))}
      </section>

      <div className="dashboard-grid dashboard-primary-grid">
        <section className="panel publishing-panel">
          <div className="panel-head">
            <div><h2>{t("Publishing overview")}</h2><p>{t("Current project publication coverage.")}</p></div>
            <span className="status-dot-label"><i /> {t("Live data")}</span>
          </div>
          <div className="publishing-body">
            <div className="publication-score">
              <div className="ring" style={{ "--progress": `${publicationPct * 3.6}deg` } as CSSProperties}>
                <div><strong>{data ? `${publicationPct}%` : "—"}</strong><span>{t("Published")}</span></div>
              </div>
            </div>
            <div className="publication-details">
              <div className="publication-row"><span><i className="legend published" /> {t("Published projects")}</span><strong>{data ? published : "—"}</strong></div>
              <div className="publication-row"><span><i className="legend draft" /> {t("Other project states")}</span><strong>{data ? draftProjects : "—"}</strong></div>
              <div className="publication-row"><span><i className="legend total" /> {t("Total projects")}</span><strong>{data ? projects : "—"}</strong></div>
              <div className="progress-track"><i style={{ width: `${publicationPct}%` }} /></div>
              <Link href="/admin/projects" className="text-link">{t("Review projects")} <AdminIcon name="chevron" size={12} /></Link>
            </div>
          </div>
        </section>

        <section className="panel quick-panel">
          <div className="panel-head"><div><h2>{t("Quick actions")}</h2><p>{t("Common administration tasks.")}</p></div></div>
          <div className="quick-action-list">
            <Link href="/admin/projects"><span className="quick-action-icon blue"><AdminIcon name="plus" size={16} /></span><div><strong>{t("Create project")}</strong><small>{t("Add a portfolio entry")}</small></div><AdminIcon name="chevron" size={14} /></Link>
            <Link href="/admin/media"><span className="quick-action-icon violet"><AdminIcon name="upload" size={16} /></span><div><strong>{t("Upload media")}</strong><small>{t("Add images or documents")}</small></div><AdminIcon name="chevron" size={14} /></Link>
            {viewer?.role !== "editor" ? <Link href="/admin/settings"><span className="quick-action-icon green"><AdminIcon name="settings" size={16} /></span><div><strong>{t("Site Settings")}</strong><small>{t("Company, homepage and SEO")}</small></div><AdminIcon name="chevron" size={14} /></Link> : null}
            {viewer?.role !== "editor" ? <Link href="/admin/messages"><span className="quick-action-icon amber"><AdminIcon name="mail" size={16} /></span><div><strong>{t("Contact Inbox")}</strong><small>{data ? `${counts.newMessages || 0} ${t("New")} ${t("messages")}` : t("Check visitor messages")}</small></div><AdminIcon name="chevron" size={14} /></Link> : null}
          </div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-secondary-grid">
        <section className="panel activity-panel">
          <div className="panel-head">
            <div><h2>{t("Recent activity")}</h2><p>{t("Latest recorded changes in the CMS.")}</p></div>
            {viewer?.role !== "editor" ? <Link className="panel-link" href="/admin/audit">{t("View audit log")}</Link> : null}
          </div>
          {!data ? (
            <div className="empty-state compact">{t("Loading recent activity…")}</div>
          ) : data.recent?.length ? (
            <div className="activity-list">
              {data.recent.slice(0, 7).map(activity => {
                const initials = String(activity.userName || "A")
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part: string) => part[0]?.toUpperCase())
                  .join("");
                return (
                  <div className="activity-item" key={activity._id}>
                    <span className="activity-avatar">{initials || "A"}</span>
                    <div className="activity-copy">
                      <strong>{activity.userName || t("Administrator")}</strong>
                      <span>{t(humanizeAuditValue(activity.action))} · {t(humanizeAuditValue(activity.resource))}</span>
                    </div>
                    <time>{activity.createdAt ? new Date(activity.createdAt).toLocaleString(language === "fa" ? "fa-AF" : language === "ps" ? "ps-AF" : "en") : "—"}</time>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state compact">{t("No activity has been recorded yet.")}</div>
          )}
        </section>

        <section className="panel records-panel">
          <div className="panel-head"><div><h2>{t("Content distribution")}</h2><p>{t("Record volume by module.")}</p></div></div>
          <div className="record-bars">
            {distribution.map(item => (
              <div className="record-bar" key={item.label}>
                <div><span>{t(item.label)}</span><strong>{data ? item.value : "—"}</strong></div>
                <div className="record-track"><i style={{ width: `${item.value ? Math.max(8, Math.round(item.value / maxValue * 100)) : 0}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="admin-summary-strip">
            <div><span>{t("Active users")}</span><strong>{data ? counts.users || 0 : "—"}</strong></div>
            <div><span>{t("New")} {t("messages")}</span><strong>{data ? counts.newMessages || 0 : "—"}</strong></div>
          </div>
        </section>
      </div>
    </>
  );
}
