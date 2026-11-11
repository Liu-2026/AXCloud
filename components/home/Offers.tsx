import { useTranslations } from "next-intl";
import { Server, Sparkles, FlaskConical, Building2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/primitives";

const icons = [Server, Sparkles, FlaskConical, Building2];
const hrefs = ["/products/ecs", "/products/maas", "/products", "/products/migration"];

export default function Offers() {
  const t = useTranslations("offers");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <div className="shell relative z-10 -mt-24 lg:-mt-28">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 bg-white rounded-[10px] border border-line shadow-[0_24px_48px_-28px_rgb(10_26_68/0.35)] overflow-hidden" role="list">
        {items.map((it, i) => {
          const Icon = icons[i];
          return (
            <li key={it.title} className="border-line [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l lg:[&:not(:first-child)]:border-t-0 lg:[&:not(:first-child)]:border-l">
              <Reveal delay={0.7 + i * 0.08} y={14} className="h-full">
              <Link href={hrefs[i]} className="group relative flex gap-4 h-full p-6 hover:bg-mist transition-colors">
                <span aria-hidden="true" className="absolute left-0 right-0 top-0 h-[2px] bg-cobalt origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-x-100" />
                <Icon size={22} strokeWidth={1.6} className="text-cobalt shrink-0 mt-0.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" aria-hidden="true" />
                <span>
                  <span className="block text-base font-semibold group-hover:text-cobalt">{it.title}</span>
                  <span className="block mt-1 text-[13px] leading-relaxed text-muted">{it.body}</span>
                </span>
              </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
