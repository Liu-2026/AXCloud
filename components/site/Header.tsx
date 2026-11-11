"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { categories, featuredSlugs, products, productBySlug, type CategoryId } from "@/lib/catalog";
import { solutions } from "@/lib/solutions";
import { pick } from "@/lib/site";
import Logo from "./Logo";
import LangSwitch from "./LangSwitch";

type MenuId = "products" | "solutions" | null;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tp = useTranslations("promo");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuId>(null);
  const [mobile, setMobile] = useState(false);
  const [promo, setPromo] = useState(true);
  const [cat, setCat] = useState<CategoryId | "featured">("featured");
  const [q, setQ] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term) {
      return products.filter(p => `${p.name.zh} ${p.name.en} ${p.desc.zh} ${p.desc.en} ${p.slug}`.toLowerCase().includes(term));
    }
    if (cat === "featured") return featuredSlugs.map(s => productBySlug(s)!).filter(Boolean);
    return products.filter(p => p.category === cat);
  }, [q, cat]);

  const hoverOpen = (id: MenuId) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(id), 90);
  };
  const hoverClose = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const navLinks: { label: string; href: string }[] = [
    { label: t("ai"), href: "/products/maas" },
    { label: t("pricing"), href: "/products/ecs#pricing" },
    { label: t("docs"), href: "/products" },
    { label: t("partners"), href: "/#service" },
  ];

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-[6px] focus:shadow">
        {t("skip")}
      </a>
      {promo && (
        <div className="bg-ice text-[13px] text-ink">
          <div className="shell flex items-center justify-center gap-3 h-9 relative pr-7">
            <span className="truncate">
              <span className="text-promo font-semibold mr-2">11.11</span>
              {tp("text")}
            </span>
            <Link href="/products/ecs" className="hidden sm:inline font-semibold text-cobalt hover:underline underline-offset-4 shrink-0">
              {tp("cta")}
            </Link>
            <button type="button" onClick={() => setPromo(false)} aria-label={tp("close")} className="absolute right-0 p-1.5 text-faint hover:text-ink">
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      <header ref={headerRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
        <div className="shell flex items-center h-16 gap-8">
          <Logo />
          <nav aria-label="主导航" className="hidden lg:flex items-stretch h-full">
            {(["products", "solutions"] as const).map(id => (
              <div key={id} className="relative flex" onMouseEnter={() => hoverOpen(id)} onMouseLeave={hoverClose}>
                <button
                  type="button"
                  aria-expanded={open === id}
                  aria-controls={`menu-${id}`}
                  onClick={() => setOpen(open === id ? null : id)}
                  className={`flex items-center gap-1 px-3.5 text-[15px] border-b-2 transition-colors ${
                    open === id ? "border-cobalt text-cobalt" : "border-transparent text-ink hover:text-cobalt"
                  }`}
                >
                  {t(id)}
                  <ChevronDown size={14} className={`transition-transform ${open === id ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              </div>
            ))}
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} className="flex items-center px-3.5 text-[15px] text-ink hover:text-cobalt border-b-2 border-transparent">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(open === "products" ? null : "products")}
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-[6px] text-muted hover:bg-mist hover:text-ink"
              aria-label={tc("search")}
            >
              <Search size={17} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <LangSwitch />
            <Link href="/console" className="hidden md:inline-flex h-9 items-center px-3 text-sm text-ink hover:text-cobalt">
              {tc("console")}
            </Link>
            <Link href="/login" className="hidden sm:inline-flex h-9 items-center px-3 text-sm text-ink hover:text-cobalt">
              {tc("login")}
            </Link>
            <Link href="/login?mode=signup" className="btn btn-primary btn-shine btn-sm ml-1 hidden sm:inline-flex">
              {tc("signup")}
            </Link>
            <button
              type="button"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-[6px] hover:bg-mist"
              aria-label={mobile ? t("closeMenu") : t("menu")}
              aria-expanded={mobile}
              onClick={() => setMobile(v => !v)}
            >
              {mobile ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* 产品菜单 */}
        <AnimatePresence>
        {open === "products" && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            id="menu-products"
            className="absolute inset-x-0 top-full bg-white border-b border-line shadow-[0_24px_48px_-24px_rgb(10_26_68/0.25)]"
            onMouseEnter={() => hoverOpen("products")}
            onMouseLeave={hoverClose}
          >
            <div className="shell grid grid-cols-[220px_1fr] min-h-[440px]">
              <ul className="border-r border-line py-5 pr-4 space-y-0.5" role="list">
                {(["featured", ...categories.map(c => c.id)] as const).map(id => {
                  const label = id === "featured" ? t("allProducts") : pick(categories.find(c => c.id === id)!.name, locale);
                  const active = !q && cat === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onMouseEnter={() => { setCat(id); setQ(""); }}
                        onFocus={() => { setCat(id); setQ(""); }}
                        onClick={() => { setCat(id); setQ(""); }}
                        className={`w-full text-left px-3 py-[7px] rounded-[6px] text-sm transition-colors ${
                          active ? "bg-ice text-cobalt font-semibold" : "text-ink hover:bg-mist"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="py-6 pl-10">
                <label className="relative block max-w-[520px] mb-6">
                  <span className="sr-only">{t("searchProducts")}</span>
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                  <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t("searchProducts")} className="field pl-10" />
                </label>
                {list.length === 0 ? (
                  <p className="text-sm text-muted">{t("noMatch")}</p>
                ) : (
                  <motion.ul
                    key={q ? `q:${q}` : cat}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22 }}
                    className="grid grid-cols-3 gap-x-8 gap-y-1"
                    role="list"
                  >
                    {list.slice(0, 24).map(p => (
                      <li key={p.slug}>
                        <Link href={`/products/${p.slug}`} className="group block rounded-[6px] px-3 py-2.5 -mx-3 hover:bg-mist">
                          <span className="flex items-center gap-2 text-[15px] font-medium text-ink group-hover:text-cobalt">
                            {pick(p.name, locale)}
                            {p.tag && <span className={`tag tag-${p.tag}`}>{tc(`tags.${p.tag}`)}</span>}
                          </span>
                          <span className="block text-[13px] text-muted leading-snug mt-0.5 line-clamp-1">{pick(p.desc, locale)}</span>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
                <Link href="/products" className="inline-block mt-6 text-sm font-semibold text-cobalt hover:underline underline-offset-4">
                  {t("allProducts")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* 解决方案菜单 */}
        {open === "solutions" && (
          <motion.div
            key="solutions"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            id="menu-solutions"
            className="absolute inset-x-0 top-full bg-white border-b border-line shadow-[0_24px_48px_-24px_rgb(10_26_68/0.25)]"
            onMouseEnter={() => hoverOpen("solutions")}
            onMouseLeave={hoverClose}
          >
            <ul className="shell grid grid-cols-4 gap-x-8 gap-y-2 py-8" role="list">
              {solutions.map(s => (
                <li key={s.id}>
                  <Link href={`/?solution=${s.id}#solutions`} className="group block rounded-[6px] p-3 -m-3 hover:bg-mist">
                    <span className="block text-[15px] font-medium group-hover:text-cobalt">{pick(s.name, locale)}</span>
                    <span className="block text-[13px] text-muted leading-snug mt-1 line-clamp-2">{pick(s.title, locale)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        </AnimatePresence>
      </header>

      {/* 移动端菜单 */}
      <AnimatePresence>
      {mobile && (
        <motion.div
          className="fixed inset-0 top-16 z-40 bg-white overflow-y-auto lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="shell py-6">
            <Link href="/products" className="block py-3 text-lg font-semibold border-b border-line">{t("allProducts")}</Link>
            {categories.map(c => (
              <details key={c.id} className="border-b border-line group">
                <summary className="flex items-center justify-between py-3 text-base list-none cursor-pointer">
                  {pick(c.name, locale)}
                  <ChevronDown size={16} className="text-faint group-open:rotate-180 transition-transform" aria-hidden="true" />
                </summary>
                <ul className="pb-3 grid grid-cols-2 gap-x-4 gap-y-2" role="list">
                  {products.filter(p => p.category === c.id).map(p => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="text-sm text-muted hover:text-cobalt">{pick(p.name, locale)}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} className="block py-3 border-b border-line">{l.label}</Link>
            ))}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Link href="/login" className="btn btn-ghost">{tc("login")}</Link>
              <Link href="/login?mode=signup" className="btn btn-primary">{tc("signup")}</Link>
              <Link href="/console" className="btn btn-ghost col-span-2">{tc("console")}</Link>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
