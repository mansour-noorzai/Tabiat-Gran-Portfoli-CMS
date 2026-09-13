"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Header from "./components/Header";
import Projects from "./components/Projects";
import { Container, Display, Lead } from "./components/ui";
import { I18nProvider, useI18n } from "./i18n";
import { ABOUT_IMAGE, ABOUT_IMAGE_2, partners as fallbackPartners, projects as fallbackProjects, stats as fallbackStats } from "./data";
import { cmsApiUrl, useCmsProjects, useCmsSite } from "./cms";

type Theme = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tg-theme");
    setTheme(saved === "dark" ? "dark" : "light");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("tg-theme", theme);
  }, [hydrated, theme]);

  return {
    theme,
    toggle: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
  };
}

function SeoSync() {
  const { lang } = useI18n();
  const site = useCmsSite();

  useEffect(() => {
    const settings = site?.settings as any;
    const title = settings?.seo?.title?.[lang];
    const description = settings?.seo?.description?.[lang];
    const ogImage = settings?.seo?.ogImage?.url;

    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
    if (ogImage) {
      let meta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", "og:image");
        document.head.appendChild(meta);
      }
      meta.content = ogImage;
    }
  }, [lang, site]);

  return null;
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function Hero() {
  const { t, lang } = useI18n();
  const site = useCmsSite();
  const projects = useCmsProjects(fallbackProjects);
  const heroStats = site?.stats?.length ? site.stats : fallbackStats;
  const availableSlides = projects
    .filter((project) => Boolean(project.cover || project.gallery[0]))
    .slice(0, 5);
  const slides = availableSlides.length ? availableSlides : fallbackProjects.slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeProject = slides[active] ?? fallbackProjects[0];

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [active, slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [paused, slides.length]);

  const showSlide = (index: number) => setActive((index + slides.length) % slides.length);

  return (
    <section id="home" className="vd-hero-section">
      <Container>
        <div
          className="vd-hero hero-project-slider"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {slides.map((project, index) => {
            const image = project.cover || project.gallery[0];
            return (
              <div key={project.id} className={`hero-project-slide absolute inset-0 ${index === active ? "is-active" : ""}`} aria-hidden={index !== active}>
                <Image
                  src={image}
                  alt={index === active ? project.title[lang] : ""}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1536px) 96vw, 1440px"
                  className="object-cover"
                />
              </div>
            );
          })}
          <div className="vd-hero-shade" />

          <div className="vd-hero-content">
            <div className="vd-hero-topline">
              <div className="vd-hero-badge">
                <span />
                {t("hero.badge")}
              </div>
              <span className="vd-hero-count" dir="ltr">
                {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="vd-hero-copy">
              <div className="vd-hero-meta">
                <span>{activeProject.donor}</span><span aria-hidden="true">•</span><span dir="ltr">{activeProject.year}</span>
              </div>
              <h1 className="localized-title">
                {activeProject.title[lang]}
              </h1>
              <p>{activeProject.short[lang]}</p>
              <div className="vd-hero-actions">
                <a href="#projects" className="vd-solid-button group">
                  {t("hero.cta1")}
                  <Arrow className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </a>
                <a href="#contact" className="vd-ghost-button">
                  {t("hero.cta2")}
                </a>
              </div>
            </div>

            <div className="vd-hero-footer">
              <span className="vd-scroll-note">{t("hero.scroll")}</span>
              <div className="vd-hero-dots" role="tablist" aria-label={t("projects.gallery")}>
                {slides.map((project, index) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={index === active}
                    aria-label={project.title[lang]}
                    key={project.id}
                    onClick={() => showSlide(index)}
                    className={`hero-project-dot ${index === active ? "is-active" : ""}`}
                  ><span className="sr-only">{project.title[lang]}</span></button>
                ))}
              </div>
            </div>
          </div>

          <button type="button" onClick={() => showSlide(active - 1)} aria-label={`${t("projects.gallery")} ${active}`} className="vd-slider-arrow is-prev">
            <Arrow className="rotate-180 rtl:rotate-0" />
          </button>
          <button type="button" onClick={() => showSlide(active + 1)} aria-label={`${t("projects.gallery")} ${active + 2}`} className="vd-slider-arrow is-next">
            <Arrow className="rtl:rotate-180" />
          </button>
        </div>

        <div className="vd-stat-strip">
          {heroStats.map((stat, index) => (
            <div key={stat.key} className="vd-stat">
              <strong>{stat.value}</strong>
              <span>{t(stat.key)}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function About() {
  const { t, lang } = useI18n();
  const site = useCmsSite();
  const projects = useCmsProjects(fallbackProjects);
  const aboutImage = site?.images?.about1 || ABOUT_IMAGE;
  const aboutImage2 = site?.images?.about2 || ABOUT_IMAGE_2;
  const values = ["v1", "v2", "v3", "v4"];
  const valueImages = values.map((_, index) => projects[index]?.cover || fallbackProjects[index]?.cover || aboutImage);

  return (
    <section id="about" className="vd-section scroll-mt-28">
      <Container>
        <div className="vd-section-heading">
          <span>01 / {t("about.kicker")}</span>
          <div>
            <Display><span className="vd-accent-text">{t("about.title1i")}</span> {t("about.title")}</Display>
            <Lead>{t("about.p1")}</Lead>
          </div>
        </div>

        <div className="vd-about-grid">
          <div className="vd-about-media">
            <Image src={aboutImage} alt={t("about.kicker")} fill sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" />
            <div className="vd-about-media-copy">
              <span>{t("about.mission")}</span>
              <p>{t("about.missiontext")}</p>
            </div>
          </div>

          <div className="vd-values-grid">
            {values.map((value, index) => (
              <article key={value}>
                <Image
                  src={valueImages[index]}
                  alt={t(`about.${value}t`)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 22vw"
                  className="vd-value-image object-cover"
                />
                <span className="vd-value-shade" aria-hidden="true" />
                <div className="vd-value-icon">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 19 19 5M10 5h9v9" /></svg>
                </div>
                <div className="vd-value-copy" lang={lang}>
                  <h3>{t(`about.${value}t`)}</h3>
                  <p>{t(`about.${value}d`)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="vd-about-note">
          <div className="vd-about-note-image"><Image src={aboutImage2} alt="" fill sizes="(max-width: 767px) 100vw, 34vw" className="object-cover" /></div>
          <p>{t("about.p2")}</p>
          <a href="#services" aria-label={t("nav.services")}><Arrow /></a>
        </div>
      </Container>
    </section>
  );
}

type PartnerItem = {
  id: string;
  name: string;
  type: "un" | "ingo" | "nngo" | "government" | "other";
  logo?: string;
  websiteUrl?: string;
};

const PARTNER_DOMAINS: Record<string, string> = {
  FAO: "fao.org",
  WFP: "wfp.org",
  UNDP: "undp.org",
  UNOPS: "unops.org",
  UNHCR: "unhcr.org",
  IOM: "iom.int",
  UNICEF: "unicef.org",
  "UN Women": "unwomen.org",
  UNEP: "unep.org",
  UNAMA: "unama.unmissions.org",
  "Aga Khan Foundation": "akf.org",
  "Mercy Corps": "mercycorps.org",
  ACTED: "acted.org",
  "Save the Children": "savethechildren.net",
  GIZ: "giz.de",
  "Concern Worldwide": "concern.net",
  Welthungerhilfe: "welthungerhilfe.org",
  NRC: "nrc.no",
  "Islamic Relief": "islamic-relief.org",
  "CARE International": "care-international.org",
  DACAAR: "dacaar.org",
  "AKDN Afghanistan": "akdn.org",
  CHA: "cha-net.org",
  AREA: "area-org.af",
  ARAA: "araa.org.af",
  "MAIL (Ministry of Agriculture)": "mail.gov.af",
  NHLP: "mail.gov.af",
  Afghanaid: "afghanaid.org.uk",
};

function partnerDomain(partner: PartnerItem) {
  if (partner.websiteUrl) {
    try {
      return new URL(partner.websiteUrl).hostname.replace(/^www\./, "");
    } catch {
      // Fall back to the verified domain map for malformed CMS URLs.
    }
  }
  return PARTNER_DOMAINS[partner.name] || "";
}

function PartnerLogo({ partner, duplicate = false }: { partner: PartnerItem; duplicate?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const domain = partnerDomain(partner);
  const logo = partner.logo || (domain ? `https://${domain}/favicon.ico` : "");
  const initials = partner.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();

  const content = (
    <>
      <span className="vd-partner-logo-media">
        {logo && !imageFailed ? (
          // CMS logos can be hosted on domains outside Next Image's static allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width="72" height="72" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </span>
      <span className="vd-partner-logo-name">{partner.name}</span>
    </>
  );

  return partner.websiteUrl && !duplicate ? (
    <a className="vd-partner-logo-card" href={partner.websiteUrl} target="_blank" rel="noreferrer" aria-label={partner.name}>{content}</a>
  ) : (
    <div className="vd-partner-logo-card" aria-label={partner.name}>{content}</div>
  );
}

const SERVICE_ICONS: Record<string, ReactNode> = {
  s1: <path d="M12 21c0-6 3-10 8-12-1 8-4 11-8 12Zm0 0c0-5-2.6-8.6-7.5-10.4C5.2 18 8 21 12 21Zm0 0V9" />,
  s2: <path d="M12 3c3.6 4.4 6 7.6 6 10.5A6 6 0 0 1 6 13.5C6 10.6 8.4 7.4 12 3Z" />,
  s3: <path d="M3 20V9l9-6 9 6v11M3 20h18M7 20v-6h4v6m4 0v-4h2v4" />,
  s4: <path d="M4 11c0-3 2-5 4-5s3 1 4 1 2-1 4-1 4 2 4 5-2 9-8 9-8-6-8-9Zm4-4L6 4m10 3 2-3" />,
  s5: <path d="M3 7l9-4 9 4-9 4-9-4Zm3 5.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5M21 7v6" />,
  s6: <path d="M3 8h11v9H3V8Zm11 3h4l3 3v3h-7v-6ZM7 20a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 20Zm10 0a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 17 20Z" />,
};

function Services() {
  const { t } = useI18n();
  const site = useCmsSite();
  const services = site?.services?.length ? site.services.map((service, index) => ({ key: `s${index + 1}`, icon: service.icon || `s${index + 1}` })) : ["s1", "s2", "s3", "s4", "s5", "s6"].map((key) => ({ key, icon: key }));

  return (
    <section id="services" className="vd-section vd-services-section scroll-mt-28">
      <Container>
        <div className="vd-section-heading">
          <span>02 / {t("services.kicker")}</span>
          <div><Display>{t("services.title")}</Display><Lead>{t("services.sub")}</Lead></div>
        </div>

        <div className="vd-service-list">
          {services.map((service, index) => (
            <article key={service.key} className="vd-service-row">
              <span className="vd-service-number">{String(index + 1).padStart(2, "0")}.</span>
              <span className="vd-service-icon">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.s1}</svg>
              </span>
              <h3>{t(`${service.key}.t`)}</h3>
              <p>{t(`${service.key}.d`)}</p>
              <a href="#contact" aria-label={`${t("nav.contact")}: ${t(`${service.key}.t`)}`}><Arrow /></a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Partners() {
  const { t } = useI18n();
  const site = useCmsSite();
  const fallbackItems: PartnerItem[] = (Object.entries(fallbackPartners) as Array<["un" | "ingo" | "nngo", string[]]>).flatMap(([type, names]) =>
    names.map((name, index) => ({ id: `${type}-${index}`, name, type })),
  );
  const partners: PartnerItem[] = site?.partners?.length ? site.partners : fallbackItems;
  const carouselItems = [...partners, ...partners];

  return (
    <section id="partners" className="vd-section vd-partners-section scroll-mt-28 text-white">
      <Container>
        <div className="vd-section-heading is-inverse">
          <span>04 / {t("partners.kicker")}</span>
          <div><Display inverse>{t("partners.title")}</Display><Lead className="!text-white/65">{t("partners.sub")}</Lead></div>
        </div>
        <div className="vd-partner-carousel" aria-label={t("partners.kicker")}>
          <div className="vd-partner-track">
            {carouselItems.map((partner, index) => (
              <div key={`${partner.id}-${index}`} className={index >= partners.length ? "is-duplicate" : undefined} aria-hidden={index >= partners.length || undefined}>
                <PartnerLogo partner={partner} duplicate={index >= partners.length} />
              </div>
            ))}
          </div>
        </div>
        <p className="vd-partner-note">{t("partners.note")}</p>
      </Container>
    </section>
  );
}

function ScrollToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 640);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      type="button"
      className={`vd-scroll-top ${visible ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`${t("nav.home")} ↑`}
      title={`${t("nav.home")} ↑`}
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 14 6-6 6 6" />
      </svg>
    </button>
  );
}

function ContactIcon({ path }: { path: string }) {
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lime-300"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg></span>;
}

function Contact() {
  const { t } = useI18n();
  const site = useCmsSite();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent" || status === "error") {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [status]);

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());
    try {
      const response = await fetch(cmsApiUrl("/api/public/contact"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to send message");
      formElement.reset();
      setStatus("sent");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send message");
      setStatus("error");
    }
  }

  const phone = [site?.contact?.phonePrimary, site?.contact?.phoneSecondary].filter(Boolean).join(" / ") || "+93 700 123 456 / +93 780 987 654";
  const email = [site?.contact?.emailGeneral, site?.contact?.emailTenders].filter(Boolean).join(" / ") || "info@tabiatgran.af / tenders@tabiatgran.af";
  const information = [
    { key: "contact.address", value: t("contact.addressv"), path: "M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z", ltr: false },
    { key: "contact.phone", value: phone, path: "M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4Z", ltr: true },
    { key: "contact.email2", value: email, path: "M3 6h18v12H3zM3 7l9 6 9-6", ltr: true },
    { key: "contact.hours", value: t("contact.hoursv"), path: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", ltr: false },
  ];
  const field = "glass-input mt-2 w-full rounded-2xl px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 dark:text-white sm:text-sm";

  return (
    <section id="contact" className="vd-section vd-contact-section scroll-mt-28">
      <Container>
        <div className="vd-contact-shell">
          <div className="vd-contact-grid">
            <div className="vd-contact-panel">
              <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />
              <div className="relative"><span className="vd-contact-kicker">05 / {t("contact.kicker")}</span><h2>{t("contact.title")}</h2><p>{t("contact.sub")}</p></div>
              <div className="vd-contact-details">
                {information.map((item) => (
                  <div key={item.key} className="flex gap-3.5"><ContactIcon path={item.path} /><div className="min-w-0"><div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/45">{t(item.key)}</div><div className="mt-1 break-words text-sm font-semibold leading-6 text-white/85" dir={item.ltr ? "ltr" : undefined}>{item.value}</div></div></div>
                ))}
              </div>
            </div>

            <form onSubmit={submitContact} className="vd-contact-form">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{t("contact.name")}<input required name="name" autoComplete="name" placeholder={t("contact.name")} className={field} /></label>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{t("contact.email")}<input required name="email" type="email" autoComplete="email" placeholder={t("contact.email")} className={field} /></label>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{t("contact.org")}<input name="organization" autoComplete="organization" placeholder={t("contact.org")} className={field} /></label>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{t("contact.subject")}<input name="subject" placeholder={t("contact.subject")} className={field} /></label>
              </div>
              <label className="mt-5 block text-xs font-extrabold text-slate-700 dark:text-slate-200">{t("contact.message")}<textarea rows={5} required minLength={10} name="message" placeholder={t("contact.message")} className={`${field} resize-none`} /></label>
              <button type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="liquid-primary group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-extrabold text-white transition disabled:cursor-wait disabled:opacity-60">
                {status === "sending" ? "…" : status === "sent" ? "✓" : t("contact.send")}{status === "sent" ? null : <Arrow className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />}
              </button>
              <div ref={feedbackRef} aria-live="polite" role="status">
                {status === "sent" ? <p className="mt-4 rounded-xl bg-leaf-50 px-4 py-3 text-center text-sm font-bold text-leaf-800 dark:bg-leaf-400/10 dark:text-leaf-300">{t("contact.sent")}</p> : null}
                {status === "error" ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p> : null}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  const site = useCmsSite();
  const phone = site?.contact?.phonePrimary || "+93 700 123 456";
  const email = site?.contact?.emailGeneral || "info@tabiatgran.af";
  const links = ["about", "services", "projects", "partners", "contact"];

  return (
    <footer className="vd-footer">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
          <div><div className="text-xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">{t("brand.full")}</div><p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 dark:text-slate-400">{t("footer.about")}</p><p className="mt-4 text-[11px] font-semibold leading-5 text-slate-400">{t("footer.reg")}</p></div>
          <div><h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-leaf-800 dark:text-leaf-300">{t("footer.links")}</h3><ul className="mt-5 grid grid-cols-2 gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400 md:grid-cols-1">{links.map((link) => <li key={link}><a href={`#${link}`} className="transition hover:text-leaf-800 dark:hover:text-leaf-300">{t(`nav.${link}`)}</a></li>)}</ul></div>
          <div><h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-leaf-800 dark:text-leaf-300">{t("footer.contact")}</h3><ul className="mt-5 space-y-3 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400"><li>{t("contact.addressv")}</li><li dir="ltr">{phone}</li><li dir="ltr">{email}</li></ul></div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-[11px] font-semibold text-slate-400 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} {t("brand.full")}. {t("footer.rights")}</span><a href="#home" className="text-leaf-700 hover:text-leaf-900 dark:text-leaf-300">{t("nav.home")} ↑</a></div>
      </Container>
    </footer>
  );
}

function Site() {
  const { theme, toggle } = useTheme();
  return (
    <div className="liquid-canvas vd-canvas min-h-screen overflow-x-clip text-slate-800 dark:text-slate-200">
      <a href="#main-content" className="sr-only z-[100] rounded-lg bg-white px-4 py-3 font-bold text-slate-900 focus:not-sr-only focus:fixed focus:start-4 focus:top-4">Skip to content</a>
      <SeoSync />
      <Header theme={theme} toggleTheme={toggle} />
      <main id="main-content"><Hero /><About /><Services /><Projects /><Partners /><Contact /></main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default function App() {
  return <I18nProvider><Site /></I18nProvider>;
}
