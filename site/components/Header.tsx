"use client";

import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n, type Lang } from "../i18n";

const NAV = [
  { id: "about", key: "nav.about" },
  { id: "services", key: "nav.services" },
  { id: "projects", key: "nav.projects" },
  { id: "partners", key: "nav.partners" },
  { id: "contact", key: "nav.contact" },
];

const container = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-14";

function Logo({ name, tag }: { name: string; tag: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-leaf-700 text-white shadow-[0_10px_28px_-12px_rgba(22,101,52,0.8)] dark:bg-leaf-500">
        <span className="absolute -bottom-3 -end-3 h-8 w-8 rounded-full bg-lime-300/40" />
        <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21V9" />
          <path d="M12 16c-4.5-.5-7-3-7.5-7 4.7.3 7 2.8 7.5 7Z" />
          <path d="M12 12c.6-4.8 3.3-7.4 7.5-7.8-.2 4.7-2.8 7.3-7.5 7.8Z" />
        </svg>
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[15px] font-extrabold tracking-[-0.02em] text-slate-950 sm:text-[16px] dark:text-white">{name}</span>
        <span className="mt-1 block max-w-[190px] truncate text-[9px] font-bold uppercase tracking-[0.12em] text-leaf-700 sm:max-w-[240px] sm:text-[10px] dark:text-leaf-300">{tag}</span>
      </span>
    </span>
  );
}

export default function Header({ theme, toggleTheme }: { theme: "light" | "dark"; toggleTheme: () => void }) {
  const { t, lang, setLang, rtl } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeMenus = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setLangOpen(false);
        setMobileOpen(false);
        return;
      }
      if (event instanceof MouseEvent && langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", closeMenus);
    document.addEventListener("keydown", closeMenus);
    return () => {
      document.removeEventListener("mousedown", closeMenus);
      document.removeEventListener("keydown", closeMenus);
    };
  }, []);

  const closeNavigation = () => {
    setMobileOpen(false);
    setLangOpen(false);
  };

  return (
    <header className={`liquid-header fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "shadow-[0_18px_42px_-30px_rgba(15,23,42,0.58)]" : "border-transparent"}`}>
      <div className="liquid-deep hidden border-b border-white/10 text-white md:block">
        <div className={`${container} flex h-8 items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70`}>
          <span>{t("brand.tag")}</span>
          <a href="#contact" className="transition hover:text-lime-300">{t("nav.quote")} <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <div className={`${container} flex h-[72px] items-center justify-between gap-3 md:h-[76px]`}>
        <a href="#home" onClick={closeNavigation} className="min-w-0 max-w-[150px] sm:max-w-none" aria-label={t("nav.home")}>
          <Logo name={t("brand.name")} tag={t("brand.tag")} />
        </a>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-white/55 hover:text-leaf-800 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-leaf-300">
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative hidden sm:block" ref={langRef}>
            <button type="button" onClick={() => setLangOpen((open) => !open)} aria-expanded={langOpen} aria-haspopup="listbox" aria-label={t("lang.select")} className="glass-control flex h-11 items-center gap-2 rounded-2xl px-3 text-xs font-bold text-slate-700 transition hover:text-leaf-800 dark:text-slate-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.7 3.7 5.7 3.7 9S14.4 18.3 12 21c-2.4-2.7-3.7-5.7-3.7-9S9.6 5.7 12 3Z" /></svg>
              {lang.toUpperCase()}
              <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg>
            </button>

            {langOpen ? (
              <div role="listbox" className={`glass-popover absolute top-14 w-48 overflow-hidden rounded-2xl p-1.5 ${rtl ? "start-0" : "end-0"}`}>
                {LANGS.map((item) => (
                  <button type="button" role="option" aria-selected={lang === item.code} key={item.code} onClick={() => { setLang(item.code as Lang); setLangOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm transition hover:bg-leaf-50 dark:hover:bg-white/5 ${lang === item.code ? "font-bold text-leaf-800 dark:text-leaf-300" : "text-slate-600 dark:text-slate-300"}`}>
                    <span>{item.native}</span><span className="text-[10px] font-bold tracking-widest text-slate-400">{item.flag}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")} title={theme === "dark" ? t("theme.light") : t("theme.dark")} className="glass-control grid h-11 w-11 place-items-center rounded-2xl text-slate-700 transition hover:text-leaf-800 dark:text-slate-200 dark:hover:text-lime-300">
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" /></svg>
            )}
          </button>

          <a href="#contact" className="liquid-primary hidden h-11 items-center rounded-2xl px-5 text-[12px] font-bold text-white transition lg:flex">{t("nav.quote")}</a>

          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Menu" aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="glass-control grid h-11 w-11 place-items-center rounded-2xl text-slate-800 xl:hidden dark:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">{mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="glass-popover border-x-0 border-b-0 px-4 pb-5 pt-3 xl:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-1 sm:grid-cols-2">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={closeNavigation} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-leaf-50 hover:text-leaf-800 dark:text-slate-200 dark:hover:bg-white/5">{t(item.key)}</a>
            ))}
          </div>
          <div className="mx-auto mt-3 flex max-w-[1440px] gap-2 border-t border-slate-100 pt-4 dark:border-white/10 sm:hidden">
            {LANGS.map((item) => (
              <button type="button" key={item.code} onClick={() => setLang(item.code as Lang)} className={`flex-1 rounded-xl border px-2 py-2.5 text-xs font-bold ${lang === item.code ? "border-leaf-700 bg-leaf-700 text-white dark:border-leaf-400 dark:bg-leaf-500" : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"}`}>{item.native}</button>
            ))}
          </div>
          <a href="#contact" onClick={closeNavigation} className="liquid-primary mx-auto mt-3 flex min-h-12 max-w-[1440px] items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold text-white">{t("nav.quote")}</a>
        </nav>
      ) : null}
    </header>
  );
}
