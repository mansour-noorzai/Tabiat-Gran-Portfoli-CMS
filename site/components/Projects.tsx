import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { projects as fallbackProjects, type Project } from "../data";
import { useCmsProjects, useCmsSite } from "../cms";
import { Container, Display, Eyebrow, Lead } from "./ui";

function CatBadge({ cat }: { cat: Project["category"] }) {
  const { t } = useI18n();
  return (
    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-leaf-800 shadow-sm dark:bg-[#0e1a13]/90 dark:text-leaf-200">
      {t(`cat.${cat}`)}
    </span>
  );
}

function Modal({ p, onClose }: { p: Project; onClose: () => void }) {
  const { t, lang } = useI18n();
  const [active, setActive] = useState(0);
  const images = [p.cover, ...p.gallery];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6">
      <div
        className="animate-fade-up relative my-6 w-full max-w-4xl overflow-hidden rounded-[2rem] bg-sand-100 shadow-2xl dark:bg-[#0e1713]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={t("projects.close")}
          className="absolute end-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <img src={images[active]} alt="" className="h-56 w-full object-cover sm:h-80" />

        <div className="flex gap-2 overflow-x-auto bg-earthy-100/60 p-3 dark:bg-white/5">
          {images.map((im, i) => (
            <button
              key={im}
              onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                active === i ? "border-leaf-600" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={im} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="space-y-6 p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-2">
            <CatBadge cat={p.category} />
            <span className="rounded-full bg-earthy-500/15 px-3 py-1 text-[11px] font-semibold text-earthy-700 dark:bg-white/5 dark:text-earthy-200">
              {p.donor}
            </span>
          </div>

          <h3 className="font-display text-2xl font-medium leading-tight tracking-tight text-leaf-950 sm:text-3xl dark:text-white">
            {p.title[lang]}
          </h3>

          <div className="grid gap-4 rounded-3xl border border-slate-300/40 bg-sand-100 p-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/[0.02]">
            {[
              ["projects.donor", p.donor],
              ["projects.location", p.location[lang]],
              ["projects.year", p.year],
              ["projects.beneficiaries", p.beneficiaries[lang]],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-earthy-700/70 dark:text-slate-500">
                  {t(k)}
                </div>
                <div className="mt-1 text-sm font-medium leading-6 text-slate-800 dark:text-slate-100">
                  {v}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[15px] leading-8 text-slate-600 dark:text-slate-300">
            {p.description[lang]}
          </p>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-leaf-700 dark:text-leaf-300">
              {t("projects.outcomes")}
            </h4>
            <ul className="grid gap-2.5 sm:grid-cols-3">
              {p.outcomes.map((o, i) => (
                <li
                  key={i}
                  className="rounded-2xl bg-leaf-600/8 p-3.5 text-sm leading-6 text-slate-700 ring-1 ring-leaf-600/15 dark:bg-leaf-400/5 dark:text-slate-200 dark:ring-leaf-400/10"
                >
                  <span className="me-2 font-bold text-leaf-700 dark:text-leaf-300">✓</span>
                  {o[lang]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { t, lang } = useI18n();
  const site = useCmsSite();
  const projects = useCmsProjects(fallbackProjects);
  const [cat, setCat] = useState("all");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const categories = ["all", ...(site?.categories?.length ? site.categories.map((c) => c.slug) : Array.from(new Set(projects.map((p) => p.category))))];
  const list = cat === "all" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section id="projects" className="scroll-mt-24 py-24 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{t("projects.kicker")}</Eyebrow>
          <Display className="mt-5">{t("projects.title")}</Display>
          <Lead className="mx-auto mt-6">{t("projects.sub")}</Lead>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                cat === c
                  ? "bg-leaf-700 text-white shadow-lg shadow-leaf-900/20 dark:bg-leaf-500"
                  : "border border-slate-300/60 bg-sand-100 text-slate-600 hover:border-leaf-600/40 hover:text-leaf-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              {c === "all" ? t("projects.all") : t(`cat.${c}`)}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-300/40 bg-sand-100 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-leaf-600/30 hover:shadow-2xl hover:shadow-leaf-900/10 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.cover}
                  alt={p.title[lang]}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
                  <CatBadge cat={p.category} />
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-black/50 dark:text-white">
                    {p.year}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-earthy-700/80 dark:text-leaf-300">
                  {p.donor}
                </div>
                <h3 className="font-display text-[19px] font-medium leading-7 tracking-tight text-leaf-950 dark:text-white">
                  {p.title[lang]}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {p.short[lang]}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-leaf-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span className="truncate">{p.location[lang]}</span>
                </div>

                <button
                  onClick={() => setOpenProject(p)}
                  className="group/btn mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-leaf-700/25 px-5 py-2.5 text-[13px] font-semibold text-leaf-800 transition hover:bg-leaf-700 hover:text-white dark:border-leaf-400/30 dark:text-leaf-200 dark:hover:bg-leaf-500"
                >
                  {t("projects.view")}
                  <span className="rtl:rotate-180 transition-transform group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {openProject && <Modal p={openProject} onClose={() => setOpenProject(null)} />}
    </section>
  );
}
