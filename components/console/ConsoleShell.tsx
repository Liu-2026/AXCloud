"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bell, BrainCircuit, Database, HardDrive, LayoutDashboard, LifeBuoy, Menu, Receipt, Search, Server, X, ArrowLeft } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { motion } from "motion/react";
import { Mark } from "@/components/site/Logo";
import LangSwitch from "@/components/site/LangSwitch";

const nav = [
  { href: "/console", key: "overview", icon: LayoutDashboard },
  { href: "/console/ecs", key: "ecs", icon: Server },
  { href: "/console/storage", key: "storage", icon: HardDrive },
  { href: "/console/database", key: "database", icon: Database },
  { href: "/console/maas", key: "maas", icon: BrainCircuit },
  { href: "/console/billing", key: "billing", icon: Receipt },
  { href: "/console/tickets", key: "tickets", icon: LifeBuoy },
] as const;

export default function ConsoleShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("console");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const side = (
    <nav aria-label="Console" className="py-4">
      <ul className="space-y-0.5 px-3" role="list">
        {nav.map(({ href, key, icon: Icon }) => {
          const on = href === "/console" ? pathname === "/console" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-3 h-10 px-3 rounded-[6px] text-sm transition-colors ${
                  on ? "bg-ice text-cobalt font-semibold" : "text-ink hover:bg-mist"
                }`}
              >
                <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mx-6 my-4 border-t border-line" />
      <Link href="/" className="flex items-center gap-3 h-10 mx-3 px-3 rounded-[6px] text-sm text-muted hover:bg-mist hover:text-ink">
        <ArrowLeft size={17} strokeWidth={1.75} aria-hidden="true" />
        {t("back")}
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-40 h-12 bg-night text-white flex items-center gap-3 px-3 sm:px-4">
        <button type="button" className="lg:hidden p-1.5 rounded-[6px] hover:bg-white/10" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
        <Link href="/console" className="flex items-center gap-2 shrink-0">
          <Mark size={24} />
          <span className="text-[15px] font-semibold">{locale === "en" ? "AXCloud Console" : "安信云 控制台"}</span>
        </Link>
        <label className="relative hidden md:block ml-6 w-[360px]">
          <span className="sr-only">{t("searchPlaceholder")}</span>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
          <input placeholder={t("searchPlaceholder")} className="w-full h-8 rounded-[6px] bg-white/10 pl-9 pr-3 text-[13px] placeholder:text-white/45 focus:outline-none focus:bg-white/15" />
        </label>
        <div className="ml-auto flex items-center gap-1">
          <LangSwitch dark compact />
          <Link href="/console/tickets" className="relative p-2 rounded-[6px] text-white/80 hover:bg-white/10" aria-label={t("notices")}>
            <Bell size={17} aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-promo ring-2 ring-night" />
          </Link>
          <span className="ml-1 grid place-items-center h-8 w-8 rounded-full bg-cobalt text-[13px] font-semibold" aria-label="Demo user">D</span>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden lg:block w-[220px] shrink-0 bg-white border-r border-line min-h-[calc(100vh-48px)] sticky top-12 self-start">{side}</aside>
        {open && (
          <div className="fixed inset-0 top-12 z-30 lg:hidden">
            <div className="absolute inset-0 bg-night/40" onClick={() => setOpen(false)} />
            <aside className="relative w-[240px] h-full bg-white">{side}</aside>
          </div>
        )}
        <main id="main" className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export function PageHead({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, actions, className = "" }: { title?: string; children: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-[10px] border border-line ${className}`}>
      {title && (
        <div className="flex items-center justify-between h-12 px-5 border-b border-line">
          <h2 className="text-[15px] font-semibold">{title}</h2>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusDot({ status, label }: { status: "running" | "stopped" | "starting" | "processing" | "resolved" | "paid" | "unpaid"; label: string }) {
  const color =
    status === "running" || status === "resolved" || status === "paid"
      ? "bg-signal"
      : status === "starting" || status === "processing"
        ? "bg-cobalt animate-pulse"
        : status === "unpaid"
          ? "bg-promo"
          : "bg-faint";
  return (
    <span className="inline-flex items-center gap-2 text-[13px]">
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
      {label}
    </span>
  );
}
