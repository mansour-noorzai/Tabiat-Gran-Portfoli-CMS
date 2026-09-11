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

function Logo({ name, tag }: { name: string; tag: string }) {
  return (
    <span className="vd-logo">
      <span className="vd-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 24V10" />
          <path d="M14 18C8.5 17.5 5.5 14.5 5 9c5.7.4 8.6 3.3 9 9Z" />
          <path d="M14 14c.7-5.7 4-8.8 9-9.2-.3 5.6-3.4 8.7-9 9.2Z" />
        </svg>
      </span>
      <span className="vd-logo-copy"><strong>{name}</strong><small>{tag}</small></span>
    </span>
  );
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  return theme === "dark" ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" /></svg>
  );
}

export default function Header({ theme, toggleTheme }: { theme: "light" | "dark"; toggleTheme: () => void }) {
  const { t, lang, setLang, rtl } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
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
    <header className={`vd-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="vd-header-inner">
        <a href="#home" onClick={closeNavigation} className="min-w-0" aria-label={t("nav.home")}>
          <Logo name={t("brand.name")} tag={t("brand.tag")} />
        </a>

        <nav className="vd-desktop-nav" aria-label="Primary navigation">
          {NAV.map((item) => <a key={item.id} href={`#${item.id}`}>{t(item.key)}</a>)}
        </nav>

        <div className="vd-header-actions">
          <div className="relative hidden sm:block" ref={langRef}>
            <button type="button" onClick={() => setLangOpen((open) => !open)} aria-expanded={langOpen} aria-haspopup="listbox" aria-label={t("lang.select")} className="vd-icon-button vd-language-button">
              <span>{lang.toUpperCase()}</span>
              <svg viewBox="0 0 20 20" className={langOpen ? "rotate-180" : ""} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg>
            </button>
            {langOpen ? (
              <div role="listbox" className={`vd-language-menu ${rtl ? "start-0" : "end-0"}`}>
                {LANGS.map((item) => (
                  <button type="button" role="option" aria-selected={lang === item.code} key={item.code} onClick={() => { setLang(item.code as Lang); setLangOpen(false); }} className={lang === item.code ? "is-active" : ""}>
                    <span>{item.native}</span><small>{item.flag}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")} title={theme === "dark" ? t("theme.light") : t("theme.dark")} className="vd-icon-button vd-theme-button"><ThemeIcon theme={theme} /></button>
          <a href="#contact" className="vd-header-cta"><span>{t("nav.quote")}</span><span aria-hidden="true">↗</span></a>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Menu" aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="vd-icon-button vd-menu-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">{mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="vd-mobile-nav">
          {NAV.map((item) => <a key={item.id} href={`#${item.id}`} onClick={closeNavigation}>{t(item.key)}<span aria-hidden="true">↗</span></a>)}
          <div className="vd-mobile-languages sm:hidden">
            {LANGS.map((item) => <button type="button" key={item.code} onClick={() => { setLang(item.code as Lang); closeNavigation(); }} className={lang === item.code ? "is-active" : ""}>{item.native}</button>)}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
