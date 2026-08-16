import type { Metadata } from "next";
import Script from "next/script";
import "../../styles/admin.css";
import { AdminPreferencesProvider } from "@/components/AdminPreferences";

export const metadata: Metadata = {
  title: "Tabiat Gran CMS",
  description: "Website content management system",
};

const preferenceBootstrap = `(() => {
  try {
    const lang = localStorage.getItem("tg-cms-language");
    const resolved = lang === "fa" || lang === "ps" ? lang : "en";
    const root = document.documentElement;
    root.lang = resolved === "fa" ? "fa-AF" : resolved === "ps" ? "ps-AF" : "en";
    root.dir = resolved === "en" ? "ltr" : "rtl";
    root.dataset.adminLang = resolved;
    const mode = localStorage.getItem("tg-cms-theme-mode") || localStorage.getItem("tg-cms-theme") || "light";
    const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
    const accent = localStorage.getItem("tg-cms-theme-color");
    if (accent && /^#[0-9a-fA-F]{6}$/.test(accent)) root.style.setProperty("--primary", accent);
  } catch {}
})();`;

export default function CmsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <AdminPreferencesProvider>{children}</AdminPreferencesProvider>
        <Script id="cms-preferences-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: preferenceBootstrap }} />
      </body>
    </html>
  );
}
