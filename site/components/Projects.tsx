"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { useI18n } from "../i18n";
import { projects as fallbackProjects, type Project } from "../data";
import { useCmsProjects, useCmsSite } from "../cms";
import { Container, Display, Eyebrow, Lead } from "./ui";

const fallbackCover = fallbackProjects[0]?.cover ?? "";

function CategoryBadge({ category }: { category: Project["category"] }) {
  const { t } = useI18n();
  return <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md">{t(`cat.${category}`)}</span>;
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, lang } = useI18n();
  const images = Array.from(new Set([project.cover, ...project.gallery].filter(Boolean)));
  const [active, setActive] = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const activeImage = images[active] || fallbackCover;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (galleryPaused || images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [galleryPaused, images.length]);

  const showImage = (index: number) => setActive((index + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6" onClick={onClose} role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="project-modal-title" className="glass-popover animate-fade-up relative mx-auto my-3 w-full max-w-5xl overflow-hidden rounded-[1.5rem] sm:my-8 sm:rounded-[2.5rem]" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label={t("projects.close")} className="liquid-dark-card absolute end-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-2xl text-white transition hover:bg-slate-950 sm:end-5 sm:top-5">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>

        <div
          className="project-gallery relative h-64 bg-slate-100 sm:h-96 lg:h-[30rem]"
          onMouseEnter={() => setGalleryPaused(true)}
          onMouseLeave={() => setGalleryPaused(false)}
          onFocusCapture={() => setGalleryPaused(true)}
          onBlurCapture={() => setGalleryPaused(false)}
        >
          {images.length ? images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={index === active ? project.title[lang] : ""}
              aria-hidden={index !== active}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className={`project-gallery-slide object-cover ${index === active ? "is-active" : ""}`}
            />
          )) : activeImage ? <Image src={activeImage} alt={project.title[lang]} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center gap-2 sm:inset-x-8 sm:bottom-7"><CategoryBadge category={project.category} /><span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold text-slate-800">{project.year}</span></div>
          {images.length > 1 ? (
            <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between sm:inset-x-6">
              <button type="button" onClick={() => showImage(active - 1)} aria-label={`${t("projects.gallery")} ${active || images.length}`} className="liquid-dark-card grid h-11 w-11 place-items-center rounded-2xl text-white transition hover:bg-white/20">
                <span className="text-xl rtl:rotate-180" aria-hidden="true">‹</span>
              </button>
              <button type="button" onClick={() => showImage(active + 1)} aria-label={`${t("projects.gallery")} ${(active + 2) % images.length || images.length}`} className="liquid-dark-card grid h-11 w-11 place-items-center rounded-2xl text-white transition hover:bg-white/20">
                <span className="text-xl rtl:rotate-180" aria-hidden="true">›</span>
              </button>
            </div>
          ) : null}
          <span className="liquid-dark-card absolute end-5 top-5 rounded-full px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-white sm:end-8" dir="ltr">{active + 1} / {Math.max(images.length, 1)}</span>
        </div>

        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.025] sm:p-4">
            {images.map((image, index) => (
              <button type="button" key={image} onClick={() => showImage(index)} aria-label={`${t("projects.gallery")} ${index + 1}`} aria-current={active === index ? "true" : undefined} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-28 ${active === index ? "border-leaf-600 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}>
                <Image src={image} alt="" fill sizes="112px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="p-5 sm:p-8 lg:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-leaf-700 dark:text-leaf-300">{project.donor}</p>
          <h3 id="project-modal-title" className="mt-3 max-w-4xl text-2xl font-black leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl dark:text-white">{project.title[lang]}</h3>

          <div className="glass-surface mt-7 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["projects.donor", project.donor],
              ["projects.location", project.location[lang]],
              ["projects.year", project.year],
              ["projects.beneficiaries", project.beneficiaries[lang]],
            ].map(([key, value]) => (
              <div key={key} className="border-white/50 bg-white/20 p-4 dark:border-white/10 dark:bg-white/[0.025]"><div className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">{t(key)}</div><div className="mt-1.5 text-sm font-bold leading-6 text-slate-800 dark:text-slate-100">{value}</div></div>
            ))}
          </div>

          <p className="mt-7 text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-8 dark:text-slate-300">{project.description[lang]}</p>

          {project.outcomes.length ? (
            <div className="mt-8"><h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-leaf-700 dark:text-leaf-300">{t("projects.outcomes")}</h4><ul className="mt-4 grid gap-3 sm:grid-cols-3">{project.outcomes.map((outcome, index) => <li key={index} className="rounded-2xl bg-leaf-50 p-4 text-sm font-semibold leading-6 text-slate-700 dark:bg-leaf-400/[0.07] dark:text-slate-200"><span className="me-2 text-leaf-700 dark:text-leaf-300">✓</span>{outcome[lang]}</li>)}</ul></div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { t, lang } = useI18n();
  const site = useCmsSite();
  const projects = useCmsProjects(fallbackProjects);
  const [category, setCategory] = useState("all");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const categories = ["all", ...(site?.categories?.length ? site.categories.map((item) => item.slug) : Array.from(new Set(projects.map((project) => project.category))))];
  const visibleProjects = category === "all" ? projects : projects.filter((project) => project.category === category);

  return (
    <section id="projects" className="liquid-section scroll-mt-28 py-20 sm:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div><Eyebrow>{t("projects.kicker")}</Eyebrow><Display className="mt-5 max-w-3xl">{t("projects.title")}</Display></div>
          <Lead>{t("projects.sub")}</Lead>
        </div>

        <div className="mt-10 flex max-w-full gap-2 overflow-x-auto pb-2 sm:flex-wrap" role="group" aria-label={t("projects.kicker")}>
          {categories.map((item) => (
            <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${category === item ? "liquid-primary text-white" : "glass-control text-slate-600 hover:text-leaf-800 dark:text-slate-300"}`}>
              {item === "all" ? t("projects.all") : t(`cat.${item}`)}
            </button>
          ))}
        </div>

        <div className="project-stack mt-9">
          {visibleProjects.map((project, index) => {
            const cover = project.cover || fallbackCover;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setOpenProject(project)}
                aria-label={`${t("projects.view")}: ${project.title[lang]}`}
                style={{ "--stack-index": Math.min(index, 8) } as CSSProperties}
                className="project-stack-card glass-card group grid w-full min-w-0 overflow-hidden rounded-[2rem] text-start sm:rounded-[2.75rem] lg:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="relative min-h-64 overflow-hidden bg-slate-100 sm:min-h-80 lg:min-h-[34rem]">
                  {cover ? <Image src={cover} alt={project.title[lang]} fill sizes="(max-width: 1023px) 92vw, 52vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/10" />
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 sm:inset-x-6 sm:top-6">
                    <CategoryBadge category={project.category} />
                    <span className="liquid-dark-card rounded-full px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-white" dir="ltr">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 sm:inset-x-6 sm:bottom-6">
                    <span className="liquid-dark-card rounded-full px-3 py-1.5 text-[10px] font-extrabold text-white" dir="ltr">{project.year}</span>
                    <span className="liquid-dark-card max-w-full truncate rounded-full px-3 py-1.5 text-[10px] font-bold text-white">{project.location[lang]}</span>
                  </div>
                </div>
                <div className="flex min-w-0 flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-leaf-700 dark:text-leaf-300">{project.donor}</p>
                      <span className="text-[10px] font-black tracking-[0.16em] text-slate-300 dark:text-white/20" dir="ltr">{String(index + 1).padStart(2, "0")} / {String(visibleProjects.length).padStart(2, "0")}</span>
                    </div>
                    <h3 className="localized-title mt-5 min-w-0 text-[clamp(1.65rem,4vw,3.25rem)] font-black leading-[1.02] tracking-[-0.04em] text-slate-950 dark:text-white">{project.title[lang]}</h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 dark:text-slate-300">{project.short[lang]}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200/70 pt-5 dark:border-white/10">
                    <span className="text-xs font-extrabold text-leaf-700 dark:text-leaf-300">{t("projects.view")}</span>
                    <span className="liquid-primary grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg text-white transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Container>

      {openProject ? <ProjectModal project={openProject} onClose={() => setOpenProject(null)} /> : null}
    </section>
  );
}
