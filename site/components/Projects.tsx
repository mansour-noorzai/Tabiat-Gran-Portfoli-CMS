"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6" onClick={onClose} role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="project-modal-title" className="glass-popover animate-fade-up relative mx-auto my-3 w-full max-w-5xl overflow-hidden rounded-[1.5rem] sm:my-8 sm:rounded-[2.5rem]" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label={t("projects.close")} className="liquid-dark-card absolute end-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-2xl text-white transition hover:bg-slate-950 sm:end-5 sm:top-5">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>

        <div className="relative h-64 bg-slate-100 sm:h-96">
          {activeImage ? <Image src={activeImage} alt={project.title[lang]} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center gap-2 sm:inset-x-8 sm:bottom-7"><CategoryBadge category={project.category} /><span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold text-slate-800">{project.year}</span></div>
        </div>

        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.025] sm:p-4">
            {images.map((image, index) => (
              <button type="button" key={image} onClick={() => setActive(index)} aria-label={`${t("projects.gallery")} ${index + 1}`} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-28 ${active === index ? "border-leaf-600" : "border-transparent opacity-60 hover:opacity-100"}`}>
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

function cardSpan(index: number) {
  if (index === 0) return "lg:col-span-7";
  if (index === 1) return "lg:col-span-5";
  return "lg:col-span-4";
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

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {visibleProjects.map((project, index) => {
            const cover = project.cover || fallbackCover;
            const featured = index < 2;
            return (
              <article key={project.id} className={`glass-card group flex min-w-0 flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 ${cardSpan(index)}`}>
                <div className={`relative overflow-hidden bg-slate-100 ${featured ? "h-64 sm:h-72 lg:h-80" : "h-60"}`}>
                  {cover ? <Image src={cover} alt={project.title[lang]} fill sizes={featured ? "(max-width: 1023px) 92vw, 58vw" : "(max-width: 1023px) 92vw, 32vw"} className="object-cover transition duration-700 group-hover:scale-105" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 sm:inset-x-5 sm:bottom-5"><CategoryBadge category={project.category} /><span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold text-slate-800 backdrop-blur">{project.year}</span></div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-leaf-700 dark:text-leaf-300">{project.donor}</p>
                  <h3 className={`${featured ? "text-xl sm:text-2xl" : "text-lg"} mt-3 min-w-0 font-black leading-tight tracking-[-0.025em] text-slate-950 dark:text-white`}>{project.title[lang]}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-slate-500 dark:text-slate-400">{project.short[lang]}</p>
                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-leaf-600 dark:text-leaf-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg><span className="truncate">{project.location[lang]}</span>
                  </div>
                  <button type="button" onClick={() => setOpenProject(project)} className="liquid-primary mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 text-xs font-extrabold text-white transition">
                    {t("projects.view")}<span className="rtl:rotate-180" aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Container>

      {openProject ? <ProjectModal project={openProject} onClose={() => setOpenProject(null)} /> : null}
    </section>
  );
}
