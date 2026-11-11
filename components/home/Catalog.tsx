"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, stagger } from "@/components/motion/primitives";
import { Link } from "@/i18n/navigation";
import { categories, featuredSlugs, productBySlug, products, type CategoryId, type Product } from "@/lib/catalog";
import { pick } from "@/lib/site";
import SectionHead from "./SectionHead";

export default function Catalog({ headless = false, initial = "featured" }: { headless?: boolean; initial?: CategoryId | "featured" }) {
  const t = useTranslations("catalog");
  const locale = useLocale();
  const [cat, setCat] = useState<CategoryId | "featured">(initial);
  const [q, setQ] = useState("");

  const list: Product[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term) return products.filter(p => `${p.name.zh} ${p.name.en} ${p.desc.zh} ${p.desc.en} ${p.slug}`.toLowerCase().includes(term));
    if (cat === "featured") return featuredSlugs.map(s => productBySlug(s)!);
    return products.filter(p => p.category === cat);
  }, [cat, q]);

  const current = cat !== "featured" ? categories.find(c => c.id === cat) : undefined;

  return (
    <section id="products" className="bg-mist py-24 lg:py-28 scroll-mt-16" aria-labelledby={headless ? undefined : "catalog-title"}>
      <div className="shell">
        {!headless && (
          <Reveal>
          <SectionHead
            id="catalog-title"
            title={t("title")}
            body={t("body")}
            aside={
              <label className="relative w-full sm:w-[320px]">
                <span className="sr-only">{t("filter")}</span>
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("filter")} className="field pl-10" />
              </label>
            }
          />
          </Reveal>
        )}
        {headless && (
          <label className="relative block w-full sm:w-[420px]">
            <span className="sr-only">{t("filter")}</span>
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("filter")} className="field pl-10" />
          </label>
        )}

        <div className="mt-10 grid lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
          {/* 分类导航：移动端横向滚动 */}
          <nav aria-label={t("title")} className="-mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible [scrollbar-width:none]">
            <ul className="flex lg:flex-col gap-1 lg:sticky lg:top-24 w-max lg:w-auto" role="list">
              {(["featured", ...categories.map(c => c.id)] as const).map(id => {
                const on = !q && cat === id;
                const label = id === "featured" ? t("featured") : pick(categories.find(c => c.id === id)!.name, locale);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => { setCat(id); setQ(""); }}
                      className={`relative w-full whitespace-nowrap text-left px-3 py-2 rounded-[6px] text-sm transition-colors ${
                        on ? "text-cobalt font-semibold" : "text-muted hover:text-ink"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId={`rail-${headless ? "page" : "home"}`}
                          aria-hidden="true"
                          className="absolute inset-0 rounded-[6px] bg-white shadow-[0_1px_2px_rgb(10_26_68/0.08)]"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        >
                          <span className="hidden lg:block absolute -left-3 top-2 bottom-2 w-[3px] rounded-full bg-cobalt" />
                        </motion.span>
                      )}
                      <span className="relative">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            <p className="text-sm text-muted mb-4" aria-live="polite">
              {current && <span className="text-ink font-medium mr-2">{pick(current.blurb, locale)}</span>}
              {t("count", { count: list.length })}
            </p>
            {list.length === 0 ? (
              <p className="py-16 text-center text-muted bg-white rounded-[10px] border border-line">{t("empty")}</p>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={q ? `q:${q}` : cat}
                className="grid sm:grid-cols-2 xl:grid-cols-3 gap-px bg-line border border-line rounded-[10px] overflow-hidden"
                role="list"
                variants={stagger.parent}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              >
                {list.map(p => <Item key={p.slug} p={p} locale={locale} />)}
                {/* 补齐最后一行的空格子，保持网格线完整 */}
                {Array.from({ length: (3 - (list.length % 3)) % 3 }).map((_, i) => (
                  <li key={`pad-${i}`} aria-hidden="true" className="hidden xl:block bg-white" />
                ))}
                {list.length % 2 === 1 && <li aria-hidden="true" className="hidden sm:block xl:hidden bg-white" />}
              </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ p, locale }: { p: Product; locale: string }) {
  const tc = useTranslations("common");
  return (
    <motion.li className="bg-white" variants={stagger.child}>
      <Link href={`/products/${p.slug}`} className="group relative flex flex-col h-full p-5 hover:bg-[#fbfcff]">
        <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-cobalt origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />
        <span className="flex items-center gap-2">
          <span className="font-semibold text-[15px] group-hover:text-cobalt transition-colors">{pick(p.name, locale)}</span>
          {p.tag && <span className={`tag tag-${p.tag}`}>{tc(`tags.${p.tag}`)}</span>}
        </span>
        <span className="mt-1.5 text-[13px] text-muted leading-relaxed flex-1">{pick(p.desc, locale)}</span>
        <span className="mt-4 text-[13px]">
          {p.from !== undefined && p.from > 0 ? (
            <>
              {locale === "en" && <span className="text-muted">{tc("from")} </span>}
              <span className="text-promo font-semibold">¥<span className="figure text-[17px]">{p.from}</span></span>
              <span className="text-muted">{tc("perMonth")}{locale === "zh" && tc("from")}</span>
            </>
          ) : (
            <span className="text-faint">{p.from === 0 ? tc("tags.free") : tc("payg")}</span>
          )}
        </span>
      </Link>
    </motion.li>
  );
}
