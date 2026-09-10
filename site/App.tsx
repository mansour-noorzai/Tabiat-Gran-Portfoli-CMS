"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Header from "./components/Header";
import Projects from "./components/Projects";
import { Container, Display, Eyebrow, Lead } from "./components/ui";
import { I18nProvider, useI18n } from "./i18n";
import { ABOUT_IMAGE, ABOUT_IMAGE_2, HERO_IMAGE, partners as fallbackPartners, stats as fallbackStats } from "./data";
import { cmsApiUrl, useCmsSite } from "./cms";

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
  const { t } = useI18n();
  const site = useCmsSite();
  const settings = site?.settings as any;
  const heroImage = site?.images?.hero || HERO_IMAGE;
  const heroStats = site?.stats?.length ? site.stats : fallbackStats;
  const establishedYear = settings?.company?.establishedYear || "2009";
  const provinceCount = heroStats.find((stat) => stat.key === "stats.provinces")?.value || "24";

  return (
    <section id="home" className="liquid-section relative overflow-hidden pb-10 pt-[104px] sm:pb-14 md:pt-[132px]">
      <div className="site-grid pointer-events-none absolute inset-0 opacity-55 dark:opacity-20" />
      <div className="pointer-events-none absolute -start-28 top-40 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl dark:bg-leaf-500/10" />

      <Container className="relative grid items-center gap-12 pb-12 pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:pb-16 lg:pt-14 xl:gap-24">
        <div className="order-2 lg:order-1">
          <div className="glass-control inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-leaf-800 dark:text-leaf-200">
            <span className="h-2 w-2 rounded-full bg-leaf-500 shadow-[0_0_0_4px_rgba(34,197,94,0.12)]" />
            {t("hero.badge")}
          </div>

          <h1 className="mt-7 max-w-3xl text-[clamp(2.55rem,7vw,5.6rem)] font-black leading-[0.96] tracking-[-0.055em] text-slate-950 dark:text-white">
            {t("hero.title1").replace(".", " ")}
            <span className="mt-2 block font-display font-normal italic tracking-[-0.035em] text-leaf-700 dark:text-leaf-300">{t("hero.title2")}</span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">{t("hero.sub")}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="liquid-primary group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold text-white transition hover:-translate-y-0.5">
              {t("hero.cta1")}
              <Arrow className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
            <a href="#contact" className="glass-control inline-flex min-h-12 items-center justify-center rounded-2xl px-6 text-sm font-bold text-slate-800 transition hover:text-leaf-800 dark:text-white">
              {t("hero.cta2")}
            </a>
          </div>

          <div className="mt-9 flex items-center gap-4 border-t border-slate-200 pt-6 dark:border-white/10">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {["bg-leaf-200", "bg-earthy-200", "bg-lime-200"].map((tone, index) => (
                <span key={tone} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[10px] font-extrabold text-leaf-900 dark:border-[#09110d] ${tone}`}>{index + 1}</span>
              ))}
            </div>
            <p className="max-w-xs text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{t("about.mission")}: {t("about.missiontext")}</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute -inset-4 -rotate-2 rounded-[2.5rem] bg-leaf-100 dark:bg-leaf-500/10 sm:-inset-6" />
            <div className="hero-frame liquid-image relative aspect-[4/4.45] overflow-hidden rounded-[2rem] bg-leaf-100 sm:rounded-[2.75rem]">
              <Image src={heroImage} alt={t("brand.full")} fill priority sizes="(max-width: 1023px) 92vw, 52vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-leaf-950/55 via-transparent to-white/5" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
                <div className="max-w-[70%] text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-200">{t("brand.tag")}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 sm:text-base">{t("brand.full")}</p>
                </div>
                <span className="liquid-dark-card grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-center text-sm font-black text-white sm:h-16 sm:w-16">{establishedYear}</span>
              </div>
            </div>
            <div className="glass-surface absolute -bottom-5 -start-2 hidden rounded-2xl px-5 py-4 sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-100 text-leaf-800 dark:bg-leaf-400/10 dark:text-leaf-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 20V9l8-5 8 5v11M4 20h16M9 20v-6h6v6" /></svg>
                </span>
                <div><div className="text-xl font-black text-slate-950 dark:text-white">{provinceCount}</div><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{t("stats.provinces")}</div></div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <div className="glass-surface grid grid-cols-2 overflow-hidden rounded-3xl lg:grid-cols-4">
          {heroStats.map((stat, index) => (
            <div key={stat.key} className={`px-4 py-6 text-center sm:px-6 sm:py-7 ${index % 2 ? "border-s border-slate-200 dark:border-white/10" : ""} ${index > 1 ? "border-t border-slate-200 dark:border-white/10 lg:border-t-0 lg:border-s" : ""}`}>
              <div className="text-2xl font-black tracking-tight text-leaf-800 sm:text-3xl dark:text-leaf-300">{stat.value}</div>
              <div className="mx-auto mt-1.5 max-w-[150px] text-[10px] font-bold uppercase leading-4 tracking-[0.1em] text-slate-500 sm:text-[11px] dark:text-slate-400">{t(stat.key)}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function About() {
  const { t } = useI18n();
  const site = useCmsSite();
  const aboutImage = site?.images?.about1 || ABOUT_IMAGE;
  const aboutImage2 = site?.images?.about2 || ABOUT_IMAGE_2;
  const values = ["v1", "v2", "v3", "v4"];

  return (
    <section id="about" className="liquid-section scroll-mt-28 py-20 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20 xl:gap-28">
        <div className="relative mx-auto w-full max-w-xl pb-10 pe-6 sm:pb-16 sm:pe-14">
          <div className="liquid-image relative aspect-[5/5.4] overflow-hidden rounded-[2rem] bg-slate-100 sm:rounded-[2.75rem]">
            <Image src={aboutImage} alt={t("about.kicker")} fill sizes="(max-width: 1023px) 90vw, 45vw" className="object-cover" />
          </div>
          <div className="liquid-image absolute bottom-0 end-0 aspect-[4/3] w-[48%] overflow-hidden rounded-[1.5rem] border-[7px] border-white bg-slate-100 shadow-2xl dark:border-[#09110d] sm:rounded-[2rem] sm:border-[10px]">
            <Image src={aboutImage2} alt="" fill sizes="(max-width: 640px) 42vw, 250px" className="object-cover" />
          </div>
          <div className="liquid-dark-card absolute -start-2 top-8 max-w-[180px] rounded-2xl bg-leaf-950/80 px-5 py-4 text-white shadow-xl sm:-start-7 sm:top-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime-300">{t("about.mission")}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-white/85">{t("brand.tag")}</p>
          </div>
        </div>

        <div>
          <Eyebrow>{t("about.kicker")}</Eyebrow>
          <Display className="mt-5"><span className="text-leaf-700 dark:text-leaf-300">{t("about.title1i")}</span> {t("about.title")}</Display>
          <Lead className="mt-7">{t("about.p1")}</Lead>
          <Lead className="mt-4">{t("about.p2")}</Lead>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {values.map((value) => (
              <article key={value} className="glass-card rounded-2xl p-4 transition">
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-800 dark:bg-leaf-400/10 dark:text-leaf-300">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m4 10 4 4 8-9" /></svg>
                  </span>
                  <div><h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{t(`about.${value}t`)}</h3><p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{t(`about.${value}d`)}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
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
    <section id="services" className="liquid-section-tint scroll-mt-28 py-20 sm:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div><Eyebrow>{t("services.kicker")}</Eyebrow><Display className="mt-5 max-w-3xl">{t("services.title")}</Display></div>
          <Lead>{t("services.sub")}</Lead>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.key} className="glass-card group relative overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 sm:p-7">
              <div className="flex items-start justify-between gap-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-100 text-leaf-800 transition group-hover:bg-leaf-700 group-hover:text-white dark:bg-leaf-400/10 dark:text-leaf-300 dark:group-hover:bg-leaf-500 dark:group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.s1}</svg>
                </span>
                <span className="text-[11px] font-black tracking-[0.18em] text-slate-300 dark:text-white/15">0{index + 1}</span>
              </div>
              <h3 className="mt-7 text-lg font-extrabold tracking-[-0.02em] text-slate-950 dark:text-white">{t(`${service.key}.t`)}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{t(`${service.key}.d`)}</p>
              <div className="mt-6 h-1 w-10 rounded-full bg-leaf-200 transition-all duration-300 group-hover:w-20 group-hover:bg-leaf-600 dark:bg-leaf-400/20" />
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
  const dynamic = site?.partners?.length ? site.partners : null;
  const partnerGroups = dynamic ? {
    un: dynamic.filter((partner) => partner.type === "un").map((partner) => partner.name),
    ingo: dynamic.filter((partner) => partner.type === "ingo").map((partner) => partner.name),
    nngo: dynamic.filter((partner) => ["nngo", "government", "other"].includes(partner.type)).map((partner) => partner.name),
  } : fallbackPartners;
  const groups = [
    { key: "partners.un", items: partnerGroups.un },
    { key: "partners.ingo", items: partnerGroups.ingo },
    { key: "partners.nngo", items: partnerGroups.nngo },
  ];
  const testimonials = site?.testimonials?.length ? site.testimonials.map((item) => item.key) : ["t1", "t2", "t3"];

  return (
    <section id="partners" className="liquid-deep scroll-mt-28 overflow-hidden py-20 text-white sm:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div><Eyebrow inverse>{t("partners.kicker")}</Eyebrow><Display inverse className="mt-5">{t("partners.title")}</Display><p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">{t("partners.sub")}</p></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.key} className="liquid-dark-card rounded-3xl p-5">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-lime-300">{t(group.key)}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.slice(0, 8).map((item) => <li key={item} className="border-b border-white/[0.07] pb-2.5 text-xs font-semibold leading-5 text-white/75 last:border-0">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-12">
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((key, index) => (
              <figure key={key} className="liquid-dark-card rounded-3xl p-6 text-white sm:p-7">
                <div className="flex items-center justify-between"><span className="text-4xl font-black leading-none text-leaf-200 dark:text-leaf-400/30">“</span><span className="text-[10px] font-black tracking-[0.2em] text-slate-300 dark:text-white/20">0{index + 1}</span></div>
                <blockquote className="mt-3 text-sm font-medium leading-7 text-white/78">{t(`${key}.q`)}</blockquote>
                <figcaption className="mt-5 border-t border-white/10 pt-4 text-xs font-extrabold text-lime-300">{t(`${key}.a`)}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-[10px] leading-5 text-white/40">{t("partners.note")}</p>
        </div>
      </Container>
    </section>
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
    <section id="contact" className="liquid-section-tint scroll-mt-28 py-20 sm:py-28">
      <Container>
        <div className="glass-surface overflow-hidden rounded-[2rem] sm:rounded-[2.75rem]">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="liquid-deep relative overflow-hidden p-6 text-white sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />
              <div className="relative"><Eyebrow inverse>{t("contact.kicker")}</Eyebrow><h2 className="mt-5 text-[clamp(2rem,5vw,3.6rem)] font-black leading-[1.02] tracking-[-0.04em]">{t("contact.title")}</h2><p className="mt-6 text-sm leading-7 text-white/65">{t("contact.sub")}</p></div>
              <div className="relative mt-10 space-y-5">
                {information.map((item) => (
                  <div key={item.key} className="flex gap-3.5"><ContactIcon path={item.path} /><div className="min-w-0"><div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/45">{t(item.key)}</div><div className="mt-1 break-words text-sm font-semibold leading-6 text-white/85" dir={item.ltr ? "ltr" : undefined}>{item.value}</div></div></div>
                ))}
              </div>
            </div>

            <form onSubmit={submitContact} className="p-6 sm:p-10 lg:p-12">
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
    <footer className="glass-footer border-t border-white/60 py-12 dark:border-white/10 sm:py-16">
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
    <div className="liquid-canvas min-h-screen overflow-x-clip text-slate-800 dark:text-slate-200">
      <a href="#main-content" className="sr-only z-[100] rounded-lg bg-white px-4 py-3 font-bold text-slate-900 focus:not-sr-only focus:fixed focus:start-4 focus:top-4">Skip to content</a>
      <SeoSync />
      <Header theme={theme} toggleTheme={toggle} />
      <main id="main-content"><Hero /><About /><Services /><Projects /><Partners /><Contact /></main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <I18nProvider><Site /></I18nProvider>;
}
