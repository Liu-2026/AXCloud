import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, ChevronRight, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { categoryById, products, productBySlug, productsIn } from "@/lib/catalog";
import { categoryFeatures, faqsFor, specsFor, tiersFor } from "@/lib/product-content";
import { solutions } from "@/lib/solutions";
import { routing } from "@/i18n/routing";
import { pick } from "@/lib/site";
import AskAgentButton from "@/components/site/AskAgentButton";
import { CountUp, Reveal } from "@/components/motion/primitives";

export function generateStaticParams() {
  return routing.locales.flatMap(locale => products.map(p => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return { title: pick(p.name, locale), description: pick(p.desc, locale) };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = productBySlug(slug);
  if (!p) notFound();

  const t = await getTranslations("product");
  const tc = await getTranslations("common");
  const cat = categoryById(p.category);
  const features = categoryFeatures[p.category];
  const specs = specsFor(p);
  const tiers = specs ? null : tiersFor(p);
  const faqs = faqsFor(p);
  const related = productsIn(p.category).filter(x => x.slug !== p.slug).slice(0, 4);
  const scenes = solutions.filter(s => s.products.includes(p.slug));
  const buyHref = p.category === "compute" ? `/console/ecs?create=1` : "/console";
  const perMonth = tc("perMonth");

  const sections = [
    { id: "features", label: t("features") },
    { id: "pricing", label: t("specs") },
    ...(scenes.length ? [{ id: "scenarios", label: t("scenarios") }] : []),
    { id: "faq", label: t("faq") },
  ];

  return (
    <>
      <section className="bg-ice border-b border-line">
        <div className="shell pt-8 pb-16 lg:pb-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/products" className="hover:text-cobalt">{t("breadcrumb")}</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href="/products" className="hover:text-cobalt">{pick(cat.name, locale)}</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="text-ink" aria-current="page">{pick(p.name, locale)}</span>
          </nav>
          <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div>
              <h1 className="text-[36px] sm:text-[48px] font-semibold flex flex-wrap items-center gap-x-4 gap-y-2">
                {pick(p.name, locale)}
                {p.tag && <span className={`tag tag-${p.tag} text-[13px] h-6 px-2`}>{tc(`tags.${p.tag}`)}</span>}
              </h1>
              <p className="mt-4 text-lg text-muted max-w-[34em]">{pick(p.desc, locale)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={buyHref} className="btn btn-primary btn-shine h-12 px-7">{tc("buy")}</Link>
                <Link href="/login?mode=signup" className="btn btn-ghost h-12 px-7">{tc("freeTrial")}</Link>
                <AskAgentButton
                  className="btn h-12 px-4 text-cobalt hover:bg-white"
                  label={t("askAgent")}
                  prompt={locale === "en" ? `Tell me about ${p.name.en}: which size should I choose?` : `介绍一下${p.name.zh}，我该选什么规格？`}
                />
              </div>
            </div>
            {p.from !== undefined && p.from > 0 && (
              <div className="lg:text-right">
                <div className="text-[13px] text-muted">{locale === "en" ? "Starting at" : "起售价"}</div>
                <div className="text-promo">
                  ¥<CountUp className="figure text-[48px] font-bold leading-none" value={p.from} duration={1} />
                  <span className="text-muted text-sm ml-1">{perMonth}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <nav aria-label={t("overview")} className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-line">
        <ul className="shell flex gap-6 overflow-x-auto h-12 items-stretch text-sm" role="list">
          {sections.map(s => (
            <li key={s.id} className="flex">
              <a href={`#${s.id}`} className="flex items-center whitespace-nowrap text-muted hover:text-cobalt">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="features" className="shell py-20 scroll-mt-32">
        <h2 className="text-[28px] font-semibold">{t("features")}</h2>
        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10" role="list">
          {features.map((f, i) => (
            <li key={f.title.zh}>
              <Reveal delay={i * 0.08} className="group relative border-t-2 border-ink pt-5">
                <span aria-hidden="true" className="absolute -top-[2px] left-0 h-[2px] w-full bg-cobalt origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                <h3 className="text-lg font-semibold">{pick(f.title, locale)}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{pick(f.body, locale)}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section id="pricing" className="bg-mist border-y border-line py-20 scroll-mt-32">
        <div className="shell">
          <h2 className="text-[28px] font-semibold">{t("specs")}</h2>
          {specs ? (
            <div className="mt-8 overflow-x-auto rounded-[10px] border border-line bg-white">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-mist text-left text-[12px] text-muted">
                  <tr>
                    <th scope="col" className="font-normal px-5 py-3">{t("spec")}</th>
                    <th scope="col" className="font-normal px-4 py-3 text-right">{t("vcpu")}</th>
                    <th scope="col" className="font-normal px-4 py-3 text-right">{t("memory")}</th>
                    <th scope="col" className="font-normal px-4 py-3">{p.slug === "gpu" ? "GPU" : t("bandwidth")}</th>
                    <th scope="col" className="font-normal px-4 py-3 text-right">{t("price")}</th>
                    <th scope="col" className="px-5 py-3"><span className="sr-only">{tc("buy")}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map(s => (
                    <tr key={s.name} className="border-t border-line">
                      <th scope="row" className="text-left font-medium px-5 py-4 figure">{s.name}</th>
                      <td className="px-4 py-4 text-right figure">{s.cpu}</td>
                      <td className="px-4 py-4 text-right figure">{s.mem} GB</td>
                      <td className="px-4 py-4 text-muted figure">{s.extra}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-promo font-semibold">¥<span className="figure text-lg">{s.month.toLocaleString()}</span></span>
                        <span className="text-muted">{perMonth}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={buyHref} className="btn btn-ghost btn-sm">{tc("buy")}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className="mt-8 grid md:grid-cols-3 gap-4" role="list">
              {tiers!.map((tier, i) => (
                <li key={tier.name.zh} className={`rounded-[10px] bg-white border p-7 flex flex-col ${i === 1 ? "border-cobalt ring-1 ring-cobalt" : "border-line"}`}>
                  <h3 className="text-lg font-semibold">{pick(tier.name, locale)}</h3>
                  <div className="mt-4 h-12">
                    {tier.price ? (
                      <span className="text-promo">
                        ¥<span className="figure text-[36px] font-bold">{tier.price}</span>
                        <span className="text-muted text-sm">{perMonth}</span>
                      </span>
                    ) : (
                      <span className="text-xl font-semibold text-ink">{i === 2 ? tc("contactSales") : tc("payg")}</span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-2.5 text-sm flex-1" role="list">
                    {tier.points.map(pt => (
                      <li key={pt.zh} className="flex gap-2.5">
                        <Check size={16} className="text-cobalt shrink-0 mt-[3px]" aria-hidden="true" />
                        {pick(pt, locale)}
                      </li>
                    ))}
                  </ul>
                  <Link href={i === 2 ? "/#service" : buyHref} className={`btn mt-8 ${i === 1 ? "btn-primary" : "btn-ghost"}`}>
                    {i === 2 ? tc("contactSales") : tc("buy")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[13px] text-muted">{t("pricingNote")}</p>
        </div>
      </section>

      {scenes.length > 0 && (
        <section id="scenarios" className="shell py-20 scroll-mt-32">
          <h2 className="text-[28px] font-semibold">{t("scenarios")}</h2>
          <ul className="mt-8 grid md:grid-cols-2 gap-4" role="list">
            {scenes.map(s => (
              <li key={s.id}>
                <Link href={`/?solution=${s.id}#solutions`} className="block h-full rounded-[10px] border border-line p-6 hover:border-cobalt">
                  <span className="text-[13px] text-cobalt font-semibold">{pick(s.name, locale)}</span>
                  <span className="block mt-2 text-lg font-semibold">{pick(s.title, locale)}</span>
                  <span className="block mt-2 text-sm text-muted leading-relaxed">{pick(s.desc, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="faq" className={`py-20 scroll-mt-32 ${scenes.length ? "bg-mist border-t border-line" : ""}`}>
        <div className="shell grid lg:grid-cols-[1fr_2fr] gap-10">
          <h2 className="text-[28px] font-semibold">{t("faq")}</h2>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map(fq => (
              <details key={fq.q.zh} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium">
                  {pick(fq.q, locale)}
                  <Plus size={18} className="text-faint shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm text-muted leading-relaxed max-w-[44em]">{pick(fq.a, locale)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell py-20">
          <h2 className="text-[28px] font-semibold">{t("related")}</h2>
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-[10px] overflow-hidden" role="list">
            {related.map(r => (
              <li key={r.slug} className="bg-white">
                <Link href={`/products/${r.slug}`} className="block h-full p-5 hover:bg-mist">
                  <span className="font-semibold">{pick(r.name, locale)}</span>
                  <span className="block mt-1.5 text-[13px] text-muted leading-relaxed">{pick(r.desc, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
