import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { productBySlug } from "@/lib/catalog";
import { solutions } from "@/lib/solutions";
import { pick, site } from "@/lib/site";
import Logo from "./Logo";
import LangSwitch from "./LangSwitch";

const hotProducts = ["ecs", "lighthouse", "maas", "gpu", "oss", "rds-mysql", "cdn", "ssl"];

export default function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <footer className="bg-night text-white/70 text-sm">
      <div className="shell pt-16 pb-10 grid gap-12 lg:grid-cols-[1.2fr_3fr]">
        <div>
          <Logo dark />
          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-white/50 text-[13px]">{t("hotline")}</dt>
              <dd className="mt-1 flex items-center gap-2 text-white">
                <Phone size={15} aria-hidden="true" />
                <span className="figure text-xl font-semibold">{site.hotline}</span>
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={15} aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="link-grow hover:text-white">{site.email}</a>
            </div>
          </dl>
          <div className="mt-6 -ml-2.5">
            <LangSwitch dark />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterCol title={t("cols.products")}>
            {hotProducts.map(s => {
              const p = productBySlug(s)!;
              return <li key={s}><Link href={`/products/${s}`} className="link-grow hover:text-white">{pick(p.name, locale)}</Link></li>;
            })}
          </FooterCol>
          <FooterCol title={t("cols.solutions")}>
            {solutions.map(s => (
              <li key={s.id}><Link href={`/?solution=${s.id}#solutions`} className="link-grow hover:text-white">{pick(s.name, locale)}</Link></li>
            ))}
          </FooterCol>
          <FooterCol title={t("cols.support")}>
            {(t.raw("support") as string[]).map((l, i) => (
              <li key={l}><Link href={i === 3 ? "/products/icp" : i === 4 ? "/products/ecs#pricing" : "/console/tickets"} className="link-grow hover:text-white">{l}</Link></li>
            ))}
          </FooterCol>
          <FooterCol title={t("cols.company")}>
            {(t.raw("company") as string[]).map(l => (
              <li key={l}><Link href="/#service" className="link-grow hover:text-white">{l}</Link></li>
            ))}
          </FooterCol>
        </div>
      </div>
      <div className="border-t border-night-line">
        <div className="shell py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-[13px] text-white/45">
          <span>{t("rights")}</span>
          <span>{site.icp}</span>
          <span>{site.police}</span>
          <span className="md:ml-auto flex gap-5">
            <Link href="/" className="link-grow hover:text-white">{t("privacy")}</Link>
            <Link href="/" className="link-grow hover:text-white">{t("terms")}</Link>
          </span>
        </div>
        <p className="shell pb-6 text-[12px] text-white/35">{tc("demoNote")}</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-white text-[15px] font-semibold mb-4">{title}</h2>
      <ul className="space-y-2.5" role="list">{children}</ul>
    </div>
  );
}
