import { useTranslations } from "next-intl";
import { Headset, UserRoundCog, Truck, BookOpen, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHead from "./SectionHead";
import { Reveal } from "@/components/motion/primitives";
import FloatingCloud from "./FloatingCloud";

const icons = [Headset, UserRoundCog, Truck, BookOpen];

export default function Service() {
  const t = useTranslations("service");
  const tc = useTranslations("cta");
  const items = t.raw("items") as { title: string; body: string }[];
  const comp = t.raw("complianceItems") as string[];

  return (
    <>
      <section id="service" className="py-24 lg:py-32 scroll-mt-16" aria-labelledby="svc-title">
        <div className="shell">
          <Reveal>
            <SectionHead id="svc-title" title={t("title")} />
          </Reveal>
          <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10" role="list">
            {items.map((it, i) => {
              const Icon = icons[i];
              return (
                <li key={it.title}>
                  <Reveal delay={i * 0.08} className="group relative border-t-2 border-ink pt-6">
                    <span aria-hidden="true" className="absolute -top-[2px] left-0 h-[2px] w-full bg-cobalt origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-x-100" />
                    <Icon size={24} strokeWidth={1.5} className="text-cobalt transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
                    <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{it.body}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <ShieldCheck size={18} className="text-signal" aria-hidden="true" />
              {t("compliance")}
            </span>
            {comp.map(c => (
              <span key={c} className="text-muted">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ice overflow-hidden" aria-labelledby="cta-title">
        <div className="shell relative grid md:grid-cols-[1fr_auto] items-center gap-8 py-16 md:py-0 md:h-[300px]">
          <div className="relative z-10">
            <h2 id="cta-title" className="text-[28px] sm:text-[36px] font-semibold">{tc("title")}</h2>
            <p className="mt-3 text-muted text-[17px]">{tc("body")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login?mode=signup" className="btn btn-primary btn-shine h-12 px-7">{tc("primary")}</Link>
              <Link href="/#service" className="btn btn-ghost h-12 px-7">{tc("secondary")}</Link>
            </div>
          </div>
          <FloatingCloud />
        </div>
      </section>
    </>
  );
}
