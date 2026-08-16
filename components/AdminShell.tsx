"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "@/lib/permissions";
import AdminIcon, { type AdminIconName } from "@/components/AdminIcon";
import { useAdminPreferences, type AdminLanguage } from "@/components/AdminPreferences";

type NavItem = { href: string; label: string; icon: AdminIconName };
type NavGroup = { label?: string; items: NavItem[] };

type ShellUser = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  avatarPublicId?: string;
  preferredLanguage?: "en" | "fa" | "ps";
  themeMode?: "light" | "dark" | "system";
  themeColor?: string;
};

const contentNav: NavItem[] = [
  { href: "/admin/projects", label: "Projects", icon: "projects" },
  { href: "/admin/categories", label: "Project Categories", icon: "tag" },
  { href: "/admin/services", label: "Services", icon: "services" },
  { href: "/admin/statistics", label: "Homepage Statistics", icon: "chart" },
  { href: "/admin/partners", label: "Partners", icon: "partners" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quote" },
];

const pageNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/categories": "Project Categories",
  "/admin/services": "Services",
  "/admin/statistics": "Homepage Statistics",
  "/admin/partners": "Partners",
  "/admin/testimonials": "Testimonials",
  "/admin/messages": "Contact Inbox",
  "/admin/media": "Media Library",
  "/admin/settings": "Site Settings",
  "/admin/audit": "Audit Log",
  "/admin/users": "Users & Roles",
  "/admin/profile": "My Profile",
};

function UserAvatar({ user, large = false }: { user: ShellUser; large?: boolean }) {
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "AD";
  return (
    <span className={`avatar sneat-avatar ${large ? "large" : ""} ${user.avatarUrl ? "has-image" : ""}`}>
      {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : initials}
    </span>
  );
}

export default function AdminShell({ user, children }: { user: ShellUser; children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { language, themeMode, setLanguage, setThemeMode, applyUserPreferences, t } = useAdminPreferences();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    applyUserPreferences({ language: user.preferredLanguage, themeMode: user.themeMode, themeColor: user.themeColor });
  }, [user.preferredLanguage, user.themeMode, user.themeColor, applyUserPreferences]);

  const groups = useMemo<NavGroup[]>(() => {
    const management: NavItem[] = [];
    if (user.role !== "editor") management.push({ href: "/admin/messages", label: "Contact Inbox", icon: "mail" });
    management.push({ href: "/admin/media", label: "Media Library", icon: "media" });

    const system: NavItem[] = [];
    if (user.role === "super_admin" || user.role === "admin") {
      system.push({ href: "/admin/settings", label: "Site Settings", icon: "settings" });
      system.push({ href: "/admin/audit", label: "Audit Log", icon: "audit" });
    }
    if (user.role === "super_admin") system.push({ href: "/admin/users", label: "Users & Roles", icon: "users" });

    return [
      { items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }] },
      { label: "Content management", items: contentNav },
      { label: "Communication & media", items: management },
      ...(system.length ? [{ label: "Administration", items: system }] : []),
      { label: "Account", items: [{ href: "/admin/profile", label: "My Profile", icon: "users" }] },
    ];
  }, [user.role]);

  const allItems = useMemo(() => groups.flatMap(group => group.items), [groups]);
  const currentPage = t(pageNames[path] || "CMS");
  const roleLabel = t(user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Content Editor");

  useEffect(() => setSidebarOpen(false), [path]);

  async function persistNavbarPreferences(preferences: { language?: AdminLanguage; themeMode?: "light" | "dark" | "system" }) {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to update profile");
      }
    } catch (error) {
      console.error("Unable to synchronize navbar preferences", error);
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        if (response.ok && data.user) {
          applyUserPreferences({
            language: data.user.preferredLanguage,
            themeMode: data.user.themeMode,
            themeColor: data.user.themeColor,
          });
        }
      } catch (reloadError) {
        console.error("Unable to restore saved profile preferences", reloadError);
      }
    }
  }

  function changeLanguage(nextLanguage: AdminLanguage) {
    setLanguage(nextLanguage);
    void persistNavbarPreferences({ language: nextLanguage });
  }

  function toggleTheme() {
    const isDark = document.documentElement.dataset.theme === "dark";
    const nextTheme = isDark ? "light" : "dark";
    setThemeMode(nextTheme);
    void persistNavbarPreferences({ themeMode: nextTheme });
  }

  function searchNavigation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim().toLocaleLowerCase();
    if (!query) return;
    const match = allItems.find(item => `${item.label} ${t(item.label)}`.toLocaleLowerCase().includes(query));
    if (match) {
      router.push(match.href);
      setSearch("");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="admin-shell sneat-shell">
      <button type="button" aria-label={t("Close navigation")} className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar sneat-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link className="side-brand sneat-brand" href="/admin" aria-label={t("Tabiat Gran CMS dashboard")}>
          <span className="brand-emblem sneat-emblem">TG</span>
          <span className="brand-copy"><strong>Tabiat Gran</strong><small>CMS</small></span>
        </Link>

        <nav className="nav sneat-nav" aria-label={t("Admin navigation")}>
          {groups.map((group, index) => (
            <div className="nav-group" key={group.label || `main-${index}`}>
              {group.label ? <div className="nav-section"><span>{t(group.label)}</span></div> : null}
              {group.items.map(item => {
                const active = path === item.href;
                return (
                  <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                    <span className="nav-icon"><AdminIcon name={item.icon} size={20} /></span>
                    <span className="nav-label">{t(item.label)}</span>
                    {active ? <span className="nav-active-dot" /> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer sneat-sidebar-footer">
          <Link href="/admin/profile" className="sidebar-user-card">
            <UserAvatar user={user} />
            <span><strong>{user.name}</strong><small>{roleLabel}</small></span>
            <i className="online-dot" />
          </Link>
        </div>
      </aside>

      <section className="admin-main">
        <header className="topbar sneat-topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu" type="button" onClick={() => setSidebarOpen(true)} aria-label={t("Open navigation")}><AdminIcon name="menu" size={22} /></button>
            <form className="top-search sneat-search" onSubmit={searchNavigation} role="search">
              <AdminIcon name="search" size={20} />
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder={t("Search (Ctrl+/)")} aria-label={t("Search")} />
              <kbd>⌘K</kbd>
            </form>
          </div>

          <div className="topbar-actions">
            <label className="topbar-language" title={t("Language")}>
              <select value={language} onChange={event => changeLanguage(event.target.value as AdminLanguage)} aria-label={t("Language")}>
                <option value="en">EN</option><option value="fa">دری</option><option value="ps">پښتو</option>
              </select>
            </label>
            <button className="icon-btn sneat-icon-btn" type="button" onClick={toggleTheme} aria-label={themeMode === "dark" ? t("Light") : t("Dark")} title={themeMode === "dark" ? t("Light") : t("Dark")}>
              <AdminIcon name={themeMode === "dark" ? "sun" : "moon"} size={20} />
            </button>
            {user.role !== "editor" ? <Link className="icon-btn sneat-icon-btn notification-link" href="/admin/messages" aria-label={t("Contact Inbox")}><AdminIcon name="mail" size={20} /><span className="notification-dot" /></Link> : null}
            <details className="profile-menu sneat-profile-menu">
              <summary aria-label={t("Open account menu")}><UserAvatar user={user} /></summary>
              <div className="profile-popover sneat-profile-popover">
                <div className="profile-popover-head"><UserAvatar user={user} large /><div><strong>{user.name}</strong><small>{user.email}</small><span className="profile-role-inline">{roleLabel}</span></div></div>
                <div className="profile-popover-separator" />
                <Link className="profile-action" href="/admin/profile"><AdminIcon name="users" size={18} /> {t("My Profile")}</Link>
                <button type="button" className="profile-action" onClick={logout}><AdminIcon name="logout" size={18} /> {t("Sign out")}</button>
              </div>
            </details>
          </div>
        </header>

        <div className="admin-page-meta"><div className="admin-breadcrumb sneat-breadcrumb"><span>{t("Home")}</span><AdminIcon name="chevron" size={12} /><strong>{currentPage}</strong></div></div>
        <main className="content sneat-content">{children}</main>
        <footer className="admin-footer"><span>Tabiat Gran CMS</span><span>{t("Professional content administration")}</span></footer>
      </section>
    </div>
  );
}
