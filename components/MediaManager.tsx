"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminIcon from "@/components/AdminIcon";
import AdminModal from "@/components/AdminModal";
import { useAdminPreferences } from "@/components/AdminPreferences";

type MediaItem = Record<string, any>;

export default function MediaManager() {
  const { t } = useAdminPreferences();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [copied, setCopied] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Unable to load media"); return; }
    setItems(data.items || []);
  }
  useEffect(() => { void load(); }, []);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true); setError(""); setNotice("");
    const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(form) });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) { setError(data.error || "Upload failed"); return; }
    form.reset(); setUploadOpen(false); setNotice(t("Media uploaded successfully.")); await load();
  }

  async function copy(url: string, id: string) {
    await navigator.clipboard.writeText(url); setCopied(id); setTimeout(() => setCopied(""), 1200);
  }

  async function remove(media: MediaItem) {
    if (!confirm(`${t("Delete media")}: ${media.originalFilename || media.publicId}?`)) return;
    setDeletingId(media._id); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/media/${encodeURIComponent(media._id)}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.error || "Delete failed"); return; }
      setItems(current => current.filter(item => item._id !== media._id));
      setNotice(t(data.cloudinary === "already_missing" ? "Media record removed. The Cloudinary asset was already missing." : "Media deleted from Cloudinary and the CMS library."));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : t("Delete failed"));
    } finally {
      setDeletingId("");
    }
  }

  return <>
    <div className="page-head"><div><span className="eyebrow">{t("Asset management")}</span><h1>{t("Media Library")}</h1><p>{t("Manage Cloudinary-backed images and documents used across the website.")}</p></div><div className="page-actions"><span className="page-counter"><AdminIcon name="media" size={14} /> {items.length} {t("files")}</span><button className="btn btn-primary" type="button" onClick={() => setUploadOpen(true)}><AdminIcon name="upload" size={14} /> {t("Upload media")}</button></div></div>
    {error ? <div className="alert alert-error">{t(error)}</div> : null}
    {notice ? <div className="alert alert-success">{t(notice)}</div> : null}

    <section className="panel full-width-panel media-library-panel">
      <div className="panel-head compact-head"><div><h2>{t("Library")}</h2><p>{t("Copy asset URLs for use in CMS content fields.")}</p></div></div>
      <div className="media-library-body">
        {items.length ? <div className="media-grid">{items.map(media => <article className="media-card" key={media._id}>
          <div className="media-preview">{media.resourceType === "image" ? <img src={media.secureUrl || media.url} alt={media.originalFilename || t("Uploaded media")} /> : <span className="file-placeholder"><AdminIcon name="file" size={30} /><strong>{(media.format || "FILE").toUpperCase()}</strong></span>}</div>
          <div className="media-body"><div className="media-title"><strong title={media.originalFilename || media.publicId}>{media.originalFilename || media.publicId}</strong><small>{media.bytes ? `${Math.round(media.bytes / 1024)} KB` : ""}</small></div><div className="media-actions"><button className="btn btn-secondary btn-small" type="button" onClick={() => void copy(media.secureUrl || media.url, media._id)}><AdminIcon name={copied === media._id ? "check" : "copy"} size={12} />{copied === media._id ? t("Copied") : t("Copy URL")}</button><button className="icon-action danger" disabled={deletingId === media._id} type="button" onClick={() => void remove(media)} aria-label={t("Delete media")} title={t("Delete media")}><AdminIcon name="trash" size={14} /></button></div></div>
        </article>)}</div> : <div className="empty-state"><span className="empty-icon"><AdminIcon name="media" size={22} /></span><h3>{t("No media files")}</h3><p>{t("Upload your first image or PDF.")}</p></div>}
      </div>
    </section>

    <AdminModal open={uploadOpen} onClose={() => setUploadOpen(false)} labelledBy="upload-media-title">
      <form onSubmit={upload}>
        <div className="editor-head modal-editor-head"><div><span className="eyebrow">{t("Asset management")}</span><h2 id="upload-media-title">{t("Upload new media")}</h2><p>{t("Images and PDF documents up to 10 MB are stored in Cloudinary.")}</p></div><button className="icon-action modal-close" type="button" onClick={() => setUploadOpen(false)} aria-label={t("Close")}>×</button></div>
        <div className="editor-body modal-editor-body"><div className="modal-upload-drop"><span className="upload-zone-icon"><AdminIcon name="upload" size={24} /></span><label className="file-picker large"><input type="file" name="file" accept="image/*,application/pdf" required /><span>{t("Choose file")}</span></label><p>{t("JPEG, PNG, WebP, AVIF, GIF or PDF · maximum 10 MB")}</p></div></div>
        <div className="editor-footer modal-editor-footer"><button className="btn btn-primary" disabled={busy} type="submit"><AdminIcon name="upload" size={14} />{busy ? t("Uploading…") : t("Upload")}</button><button className="btn btn-secondary" type="button" onClick={() => setUploadOpen(false)}>{t("Cancel")}</button></div>
      </form>
    </AdminModal>
  </>;
}
