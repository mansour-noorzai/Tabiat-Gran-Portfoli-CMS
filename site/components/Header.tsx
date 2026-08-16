import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n, type Lang } from "../i18n";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-leaf-700 text-white shadow-sm dark:bg-leaf-500">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21c0-5 2.5-8.5 7-10-1 6-4 9-7 10Zm0 0c0-4.5-2-7.5-6-9 .6 5 2.8 8 6 9Zm0 0V11" />
          <path d="M12 7c1.5-2 2.5-3.7 3.5-5.5C14 3 12.5 5 12 7Zm0 0c-1.5-2-2.5-3.7-3.5-5.5 1.5 1 3 3 3.5 5.5Z" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[17px] font-semibold tracking-tight text-leaf-900 dark:text-white">
          Tabiat Gran
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-earthy-600/80 dark:text-slate-400">
          Agriculture Company
        </span>
      </span>
    </div>
  );
}

const NAV = [
  { id: "about", key: "nav.about" },
  { id: "services", key: "nav.services" },
  { id: "projects", key: "nav.projects" },
  { id: "partners", key: "nav.partners" },
  { id: "contact", key: "nav.contact" },
];

export default function Header({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const { t, lang, setLang, rtl } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (id: string) => {
    setMobileOpen(false);
    setLangOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-leaf-900/10 bg-sand-100/85 shadow-[0_2px_20px_-8px_rgba(23,45,32,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1310]/85"
          : "bg-transparent"
      }`}
    >
      <div className={`${ContainerClass} flex items-center justify-between gap-6 py-4 sm:py-5`}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Logo />
        </button>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-slate-700 transition hover:bg-leaf-600/10 hover:text-leaf-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-leaf-300"
            >
              {t(n.key)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {/* language */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-label={t("lang.select")}
              className="flex items-center gap-1.5 rounded-full border border-slate-300/70 bg-transparent px-3 py-2 text-[12.5px] font-semibold text-slate-700 transition hover:border-leaf-500 hover:text-leaf-700 dark:border-white/20 dark:text-slate-200 dark:hover:border-leaf-400 dark:hover:text-leaf-300"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
              </svg>
              {LANGS.find((l) => l.code === lang)?.native}
              <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {langOpen && (
              <div
                className={`absolute top-12 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#122019] ${
                  rtl ? "start-0" : "end-0"
                }`}
              >
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code as Lang);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-leaf-600/10 ${
                      lang === l.code
                        ? "font-bold text-leaf-700 dark:text-leaf-300"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="rounded bg-earthy-200/50 px-1.5 text-[10px] tracking-widest text-earthy-700 dark:bg-white/10 dark:text-slate-300">
                      {l.flag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* theme */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")}
            className="rounded-full border border-slate-300/70 bg-transparent p-2 text-slate-700 transition hover:border-leaf-500 hover:text-leaf-700 dark:border-white/20 dark:text-wheat-400 dark:hover:border-leaf-400 dark:hover:text-leaf-300"
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <button
            onClick={() => go("contact")}
            className="hidden rounded-full bg-leaf-700 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-leaf-900/25 transition hover:bg-leaf-600 md:block dark:bg-leaf-500 dark:hover:bg-leaf-400"
          >
            {t("nav.quote")}
          </button>

          {/* mobile menu */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-full border border-slate-300/70 p-2 text-slate-700 lg:hidden dark:border-white/20 dark:text-slate-200"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
              {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-sand-100 px-5 pb-5 lg:hidden dark:border-white/10 dark:bg-[#0b1310]">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="block w-full rounded-xl px-3 py-3 text-start text-sm font-medium text-slate-700 hover:bg-leaf-600/10 dark:text-slate-200"
            >
              {t(n.key)}
            </button>
          ))}
          <button
            onClick={() => go("contact")}
            className="mt-2 w-full rounded-xl bg-leaf-700 px-4 py-3 text-sm font-semibold text-white dark:bg-leaf-500"
          >
            {t("nav.quote")}
          </button>
        </div>
      )}
    </header>
  );
}

const ContainerClass = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10";
