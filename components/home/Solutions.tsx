"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, ease } from "@/components/motion/primitives";
import { Link } from "@/i18n/navigation";
import { solutions } from "@/lib/solutions";
import { productBySlug } from "@/lib/catalog";
import { pick } from "@/lib/site";
import { openAgent } from "@/lib/agent-bus";
import SectionHead from "./SectionHead";

export default function Solutions() {
  const t = useTranslations("solutions");
  const locale = useLocale();
  const params = useSearchParams();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const id = params.get("solution");
    const i = solutions.findIndex(s => s.id === id);
    if (i >= 0) setActive(i);
  }, [params]);

  const s = solutions[active];

  function onKey(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + solutions.length) % solutions.length;
    setActive(n);
    tabs.current[n]?.focus();
  }

  return (
    <section id="solutions" className="py-24 lg:py-32 scroll-mt-16" aria-labelledby="sol-title">
      <div className="shell">
        <Reveal>
          <SectionHead id="sol-title" title={t("title")} body={t("body")} />
        </Reveal>

        <div role="tablist" aria-label={t("title")} className="mt-10 flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
          {solutions.map((x, i) => (
            <button
              key={x.id}
              ref={el => { tabs.current[i] = el; }}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${x.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={e => onKey(e, i)}
              className={`relative shrink-0 px-4 h-12 text-[15px] transition-colors ${
                i === active ? "text-cobalt font-semibold" : "text-muted hover:text-ink"
              }`}
            >
              {pick(x.name, locale)}
              {i === active && <motion.span layoutId="sol-tab" aria-hidden="true" className="absolute inset-x-3 bottom-0 h-[2px] bg-cobalt" transition={{ type: "spring", stiffness: 480, damping: 38 }} />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={s.id}
          role="tabpanel"
          id={`panel-${s.id}`}
          aria-labelledby={`tab-${s.id}`}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 pt-12"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease }}
        >
          <div>
            <h3 className="text-2xl sm:text-[28px] font-semibold leading-snug">{pick(s.title, locale)}</h3>
            <p className="mt-4 text-muted leading-relaxed max-w-[34em]">{pick(s.desc, locale)}</p>
            <ul className="mt-8 space-y-3" role="list">
              {s.points.map(p => (
                <li key={p.zh} className="flex gap-3 text-[15px]">
                  <Check size={18} className="text-cobalt shrink-0 mt-1" aria-hidden="true" />
                  {pick(p, locale)}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => openAgent(`${pick(s.name, locale)}：${pick(s.title, locale)}`)} className="btn btn-ghost mt-10">
              {t("consult")}
            </button>
          </div>

          <div className="rounded-[10px] bg-mist border border-line p-6 sm:p-8">
            <h4 className="text-[13px] text-muted">{t("architecture")}</h4>
            {/* 参考架构：一条从左到右的数据通路 */}
            <ol className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-y-6" role="list">
              {s.flow.map((f, i) => (
                <li key={f.zh} className="relative flex flex-col items-center text-center">
                  {i < s.flow.length - 1 && (
                    <span aria-hidden="true" className={`absolute top-6 left-1/2 w-full h-px bg-cobalt/30 overflow-visible ${i === 1 ? "hidden sm:block" : ""}`}>
                      <span className="absolute right-0 -top-[3px] border-y-[3.5px] border-y-transparent border-l-[6px] border-l-cobalt/60" />
                      <span className="flow-packet" style={{ animationDelay: `${i * 0.45}s` }} />
                    </span>
                  )}
                  <motion.span
                    className={`relative z-10 grid place-items-center h-12 w-12 rounded-[10px] border text-sm font-semibold figure ${
                      i === 2 ? "bg-cobalt border-cobalt text-white" : "bg-white border-line text-ink"
                    }`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.1 + i * 0.09 }}
                  >
                    {i + 1}
                  </motion.span>
                  <span className="mt-3 text-[13px] font-medium px-1">{pick(f, locale)}</span>
                </li>
              ))}
            </ol>
            <h4 className="mt-10 text-[13px] text-muted">{t("involved")}</h4>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2" role="list">
              {s.products.map(slug => {
                const p = productBySlug(slug)!;
                return (
                  <li key={slug}>
                    <Link href={`/products/${slug}`} className="flex flex-col rounded-[6px] bg-white border border-line px-4 py-3 hover:border-cobalt">
                      <span className="text-sm font-semibold">{pick(p.name, locale)}</span>
                      <span className="text-[12px] text-muted line-clamp-1">{pick(p.desc, locale)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
