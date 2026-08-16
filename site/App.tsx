"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Projects from "./components/Projects";
import { Container, Display, Eyebrow, Lead } from "./components/ui";
import { I18nProvider, useI18n } from "./i18n";
import { ABOUT_IMAGE, ABOUT_IMAGE_2, HERO_IMAGE, partners as fallbackPartners, stats as fallbackStats } from "./data";
import { cmsApiUrl, useCmsSite } from "./cms";

/* ---------------- theme hook ---------------- */
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("tg-theme") : null;
    if (saved === "light" || saved === "dark") return saved;
    return typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tg-theme", theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
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
      if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
      meta.content = description;
    }
    if (ogImage) {
      let meta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (!meta) { meta = document.createElement("meta"); meta.setAttribute("property", "og:image"); document.head.appendChild(meta); }
      meta.content = ogImage;
    }
  }, [lang, site]);
  return null;
}

/* ============================= HERO ============================= */
function Hero() {
  const { t } = useI18n();
  const site = useCmsSite();
  const heroImage = site?.images?.hero || HERO_IMAGE;
  const heroStats = site?.stats?.length ? site.stats : fallbackStats;
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-sand-100 dark:bg-[#0b1310]">
      {/* soft backdrop wash instead of full dark overlay */}
      <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-sand-100/85 via-sand-100/40 to-sand-100 dark:from-[#0b1310]/90 dark:via-[#0b1310]/55 dark:to-[#0b1310]" />

      <Container className="relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32 sm:pb-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-leaf-700/20 bg-white/70 px-4 py-2 text-[12.5px] font-semibold text-leaf-800 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-leaf-200">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
            {t("hero.badge")}
          </span>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.02] tracking-tight text-leaf-950 dark:text-white">
            {t("hero.title1").replace(".", " ")}
            <br />
            <span className="italic text-leaf-700 dark:text-leaf-300">{t("hero.title2")}</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-leaf-900/70 sm:text-lg dark:text-slate-300">
            {t("hero.sub")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-2 rounded-full bg-leaf-700 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-leaf-900/25 transition hover:bg-leaf-600 dark:bg-leaf-500 dark:hover:bg-leaf-400"
            >
              {t("hero.cta1")}
              <span className="rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
            </button>
            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-7 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-leaf-500 hover:text-leaf-700"
            >
              {t("hero.cta2")}
            </button>
          </div>
        </div>

        {/* stats strip */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-300/40 bg-slate-300/40 dark:border-white/10 dark:bg-white/10 lg:grid-cols-4">
          {heroStats.map((s) => (
            <div
              key={s.key}
              className="bg-sand-100/80 px-5 py-6 text-center backdrop-blur dark:bg-[#0e1713]/80"
            >
              <div className="font-display text-3xl font-medium text-leaf-700 dark:text-leaf-300">
                {s.value}
              </div>
              <div className="mt-1.5 text-[11.5px] font-medium leading-5 text-earthy-700/80 dark:text-slate-400">
                {t(s.key)}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================= ABOUT ============================= */
function About() {
  const { t } = useI18n();
  const site = useCmsSite();
  const settings = site?.settings as any;
  const aboutImage = site?.images?.about1 || ABOUT_IMAGE;
  const aboutImage2 = site?.images?.about2 || ABOUT_IMAGE_2;
  const establishedYear = settings?.company?.establishedYear || "2009";
  const values = ["v1", "v2", "v3", "v4"];
  return (
    <section id="about" className="scroll-mt-24 py-24 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-earthy-100 dark:bg-white/5" />
          <img
            src={aboutImage}
            alt=""
            loading="lazy"
            className="h-[400px] w-full rounded-[2rem] object-cover shadow-2xl sm:h-[480px]"
          />
          <img
            src={aboutImage2}
            alt=""
            loading="lazy"
            className="absolute -bottom-12 end-4 hidden h-56 w-64 rounded-3xl border-[10px] border-sand-100 object-cover shadow-2xl sm:block dark:border-[#0b1310]"
          />
          <div className="absolute -start-4 top-8 rounded-2xl bg-leaf-700 px-5 py-4 text-white shadow-xl dark:bg-leaf-500">
            <div className="font-display text-3xl font-medium">{establishedYear}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">Est. Kabul, AF</div>
          </div>
        </div>

        <div>
          <Eyebrow>{t("about.kicker")}</Eyebrow>
          <Display className="mt-5">
            <span className="italic text-leaf-700 dark:text-leaf-300">{t("about.title1i")}</span>{" "}
            {t("about.title")}
          </Display>
          <Lead className="mt-6">{t("about.p1")}</Lead>
          <Lead className="mt-4">{t("about.p2")}</Lead>

          <div className="mt-9 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v} className="flex gap-3">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-leaf-600/15 text-leaf-700 dark:text-leaf-300">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-leaf-950 dark:text-white">
                    {t(`about.${v}t`)}
                  </h3>
                  <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                    {t(`about.${v}d`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================= SERVICES ============================= */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  s1: <path d="M12 21c0-6 3-10 8-12-1 8-4 11-8 12Zm0 0c0-5-2.6-8.6-7.5-10.4C5.2 18 8 21 12 21Zm0 0V9M9 3c1 1.5 2 2.6 3 4 1-1.4 2-2.5 3-4-1 2-2 3.5-3 5-1-1.5-2-3-3-5Z" />,
  s2: <path d="M12 3c3.6 4.4 6 7.6 6 10.5A6 6 0 0 1 6 13.5C6 10.6 8.4 7.4 12 3Z" />,
  s3: <path d="M3 20V9l9-6 9 6v11M3 20h18M7 20v-6h4v6m4 0v-4h2v4M12 3v6" />,
  s4: <path d="M4 11c0-3 2-5 4-5s3 1 4 1 2-1 4-1 4 2 4 5-2 9-8 9-8-6-8-9Zm4-4L6 4m10 3 2-3" />,
  s5: <path d="M3 7l9-4 9 4-9 4-9-4Zm3 5.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5M21 7v6" />,
  s6: <path d="M3 8h11v9H3V8Zm11 3h4l3 3v3h-7v-6ZM7 20a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 20Zm10 0a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 17 20Z" />,
};

function Services() {
  const { t } = useI18n();
  const site = useCmsSite();
  const services = site?.services?.length
    ? site.services.map((service, i) => ({ key: `s${i + 1}`, icon: service.icon || `s${i + 1}` }))
    : ["s1", "s2", "s3", "s4", "s5", "s6"].map((key) => ({ key, icon: key }));
  return (
    <section id="services" className="scroll-mt-24 bg-sand-200/60 py-24 sm:py-28 dark:bg-[#0e1a13]">
      <Container>
        <div className="flex flex-col gap-6 md:items-end md:flex-row md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>{t("services.kicker")}</Eyebrow>
            <Display className="mt-5">{t("services.title")}</Display>
          </div>
          <Lead className="md:max-w-xs">{t("services.sub")}</Lead>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.key}
              className="group relative overflow-hidden rounded-3xl border border-slate-300/40 bg-sand-100 p-8 transition duration-300 hover:-translate-y-1.5 hover:border-leaf-600/30 hover:shadow-2xl hover:shadow-leaf-900/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-leaf-400/20"
            >
              <span className="absolute end-5 top-5 font-display text-5xl font-medium text-slate-200/70 transition group-hover:text-leaf-600/20 dark:text-white/10">
                0{i + 1}
              </span>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-700/10 text-leaf-700 transition group-hover:bg-leaf-700 group-hover:text-white dark:bg-leaf-400/10 dark:text-leaf-300 dark:group-hover:bg-leaf-500 dark:group-hover:text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.s1}
                </svg>
              </div>
              <h3 className="relative mt-6 text-[17px] font-semibold text-leaf-950 dark:text-white">
                {t(`${service.key}.t`)}
              </h3>
              <p className="relative mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {t(`${service.key}.d`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================= PARTNERS ============================= */
function Partners() {
  const { t } = useI18n();
  const site = useCmsSite();
  const dynamic = site?.partners?.length ? site.partners : null;
  const partnerGroups = dynamic ? {
    un: dynamic.filter((p) => p.type === "un").map((p) => p.name),
    ingo: dynamic.filter((p) => p.type === "ingo").map((p) => p.name),
    nngo: dynamic.filter((p) => ["nngo", "government", "other"].includes(p.type)).map((p) => p.name),
  } : fallbackPartners;
  const groups = [
    { key: "partners.un", items: partnerGroups.un, tone: "border-sky-200/60 text-sky-800 dark:border-sky-400/20 dark:text-sky-200" },
    { key: "partners.ingo", items: partnerGroups.ingo, tone: "border-leaf-300/60 text-leaf-800 dark:border-leaf-400/20 dark:text-leaf-200" },
    { key: "partners.nngo", items: partnerGroups.nngo, tone: "border-earthy-300/60 text-earthy-700 dark:border-earthy-400/20 dark:text-earthy-200" },
  ];
  const marquee = [...partnerGroups.un, ...partnerGroups.ingo, ...partnerGroups.nngo];
  const testimonialKeys = site?.testimonials?.length ? site.testimonials.map((item) => item.key) : ["t1", "t2", "t3"];

  return (
    <section id="partners" className="scroll-mt-24 py-24 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{t("partners.kicker")}</Eyebrow>
          <Display className="mt-5">{t("partners.title")}</Display>
          <Lead className="mx-auto mt-6">{t("partners.sub")}</Lead>
        </div>

        {/* marquee */}
        <div className="marquee-wrap relative mt-14 overflow-hidden border-y border-slate-300/40 py-5 dark:border-white/10">
          <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-20 bg-gradient-to-r from-sand-100 to-transparent dark:from-[#0b1310]" />
          <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-20 bg-gradient-to-l from-sand-100 to-transparent dark:from-[#0b1310]" />
          <div className="animate-marquee flex w-max gap-3" dir="ltr">
            {[...marquee, ...marquee].map((p, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full border border-slate-300/50 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {groups.map((g) => (
            <div
              key={g.key}
              className={`rounded-3xl border bg-sand-100 p-7 dark:bg-white/[0.03] ${g.tone}`}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.18em]">{t(g.key)}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-lg bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-200"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">{t("partners.note")}</p>

        {/* testimonials */}
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {testimonialKeys.map((k) => (
            <figure
              key={k}
              className="relative rounded-3xl border border-slate-300/40 bg-gradient-to-b from-sand-100 to-sand-200/40 p-8 dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.01]"
            >
              <svg viewBox="0 0 24 24" className="mb-4 h-8 w-8 text-leaf-600/40" fill="currentColor">
                <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-8H6.5A2.5 2.5 0 0 1 10 9.5V7Zm11 0h-4a3 3 0 0 0-3 3v7h7v-8h-3.5a2.5 2.5 0 0 1 2.5-2.5V7Z" />
              </svg>
              <blockquote className="text-[15px] italic leading-8 text-slate-700 dark:text-slate-300">
                “{t(`${k}.q`)}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-300/50 pt-4 dark:border-white/10">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-700/10 text-sm font-bold text-leaf-700 dark:text-leaf-300">
                  ✓
                </span>
                <span className="text-xs font-semibold text-earthy-700 dark:text-slate-300">
                  {t(`${k}.a`)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================= CONTACT ============================= */
function Contact() {
  const { t } = useI18n();
  const site = useCmsSite();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSending(true); setSent(false); setSubmitError("");
    const formElement = e.currentTarget;
    const form = new FormData(formElement); const payload = Object.fromEntries(form.entries());
    try { const response = await fetch(cmsApiUrl("/api/public/contact"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to send message"); formElement.reset(); setSent(true); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Unable to send message"); } finally { setSending(false); }
  }

  const field =
    "w-full rounded-2xl border border-slate-300/60 bg-sand-100 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-leaf-600 focus:ring-4 focus:ring-leaf-600/10 dark:border-white/10 dark:bg-white/5 dark:text-white";

  const info = [
    {
      k: "contact.address",
      v: "contact.addressv",
      icon: "M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z",
    },
    {
      k: "contact.phone",
      raw: [site?.contact?.phonePrimary, site?.contact?.phoneSecondary].filter(Boolean).join(" / ") || "+93 700 123 456 / +93 780 987 654",
      icon: "M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4Z",
    },
    {
      k: "contact.email2",
      raw: [site?.contact?.emailGeneral, site?.contact?.emailTenders].filter(Boolean).join(" / ") || "info@tabiatgran.af / tenders@tabiatgran.af",
      icon: "M3 6h18v12H3zM3 7l9 6 9-6",
    },
    {
      k: "contact.hours",
      v: "contact.hoursv",
      icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
    {
      k: "contact.offices",
      v: "contact.officesv",
      icon: "M4 21V8l8-5 8 5v13M9 21v-6h6v6",
    },
  ];

  return (
    <section id="contact" className="scroll-mt-24 bg-sand-200/60 py-24 sm:py-28 dark:bg-[#0e1a13]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{t("contact.kicker")}</Eyebrow>
          <Display className="mt-5">{t("contact.title")}</Display>
          <Lead className="mx-auto mt-6">{t("contact.sub")}</Lead>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            {info.map((i) => (
              <div
                key={i.k}
                className="flex items-center gap-4 rounded-2xl border border-slate-300/40 bg-sand-100 p-4 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf-700/10 text-leaf-700 dark:bg-leaf-400/10 dark:text-leaf-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={i.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-earthy-700/70 dark:text-slate-500">
                    {t(i.k)}
                  </div>
                  <div className="mt-0.5 truncate text-sm font-medium text-slate-800 dark:text-slate-200" dir={i.raw ? "ltr" : undefined}>
                    {i.raw ?? t(i.v)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={submitContact}
            className="rounded-3xl border border-slate-300/40 bg-sand-100 p-7 sm:p-9 lg:col-span-3 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="name" placeholder={t("contact.name")} className={field} />
              <input required name="email" type="email" placeholder={t("contact.email")} className={field} />
              <input name="organization" placeholder={t("contact.org")} className={field} />
              <input name="subject" placeholder={t("contact.subject")} className={field} />
            </div>
            <textarea rows={5} required minLength={10} name="message" placeholder={t("contact.message")} className={`${field} mt-4 resize-none`} />
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <button
              type="submit"
              disabled={sending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-leaf-900/20 transition hover:bg-leaf-600 dark:bg-leaf-500 dark:hover:bg-leaf-400"
            >
              {sending ? "…" : t("contact.send")}
              <span className="rtl:rotate-180">→</span>
            </button>
            {sent && (
              <p className="mt-4 rounded-2xl bg-leaf-600/10 px-4 py-3 text-center text-sm font-semibold text-leaf-800 dark:text-leaf-300">{t("contact.sent")}</p>
            )}
            {submitError && <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-700 dark:text-red-300">{submitError}</p>}
          </form>
        </div>
      </Container>
    </section>
  );
}

/* ============================= FOOTER ============================= */
function Footer() {
  const { t } = useI18n();
  const site = useCmsSite();
  const footerPhone = site?.contact?.phonePrimary || "+93 700 123 456";
  const footerEmail = site?.contact?.emailGeneral || "info@tabiatgran.af";
  const links = ["about", "services", "projects", "partners", "contact"];
  return (
    <footer className="border-t border-slate-300/40 bg-sand-100 py-16 dark:border-white/10 dark:bg-[#0b1310]">
      <Container className="grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="font-display text-xl font-semibold text-leaf-800 dark:text-leaf-200">
            {t("brand.full")}
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
            {t("footer.about")}
          </p>
          <p className="mt-5 text-xs text-slate-400">{t("footer.reg")}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-earthy-700 dark:text-slate-300">
            {t("footer.links")}
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
            {links.map((l) => (
              <li key={l}>
                <button
                  onClick={() => document.getElementById(l)?.scrollIntoView({ behavior: "smooth" })}
                  className="transition hover:text-leaf-700 dark:hover:text-leaf-300"
                >
                  {t(`nav.${l}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-earthy-700 dark:text-slate-300">
            {t("footer.contact")}
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
            <li>{t("contact.addressv")}</li>
            <li dir="ltr">{footerPhone}</li>
            <li dir="ltr">{footerEmail}</li>
          </ul>
        </div>
      </Container>

      <Container className="mt-12 border-t border-slate-300/40 pt-7 text-center text-xs text-slate-400 dark:border-white/10">
        © {new Date().getFullYear()} {t("brand.full")}. {t("footer.rights")}
      </Container>
    </footer>
  );
}

/* ============================= SITE ============================= */
function Site() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-sand-100 font-sans text-slate-800 dark:bg-[#0b1310] dark:text-slate-200">
      <SeoSync />
      <Header theme={theme} toggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Site />
    </I18nProvider>
  );
}
