import { useTranslations } from "next-intl";
import { Bot, Cpu, DatabaseZap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHead from "./SectionHead";
import StreamDemo from "./StreamDemo";
import { Reveal } from "@/components/motion/primitives";

type ModelType = "chat" | "code" | "vision" | "embed" | "speech";
const models: { name: string; vendor: string; type: ModelType; ctx: string; price: string }[] = [
  { name: "DeepSeek-V3", vendor: "DeepSeek", type: "chat", ctx: "128K", price: "2.00" },
  { name: "Qwen3-235B-A22B", vendor: "Qwen", type: "chat", ctx: "128K", price: "2.00" },
  { name: "GLM-4.5", vendor: "Zhipu", type: "chat", ctx: "128K", price: "2.00" },
  { name: "Kimi-K2", vendor: "Moonshot", type: "chat", ctx: "128K", price: "4.00" },
  { name: "Qwen3-Coder", vendor: "Qwen", type: "code", ctx: "256K", price: "4.00" },
  { name: "Qwen2.5-VL-72B", vendor: "Qwen", type: "vision", ctx: "32K", price: "16.00" },
  { name: "bge-m3", vendor: "BAAI", type: "embed", ctx: "8K", price: "0.50" },
];
const buildIcons = [Bot, Cpu, DatabaseZap];

export default function AISection() {
  const t = useTranslations("ai");
  const build = t.raw("build") as { title: string; body: string }[];

  return (
    <section className="py-24 lg:py-32" aria-labelledby="ai-title">
      <div className="shell grid lg:grid-cols-[5fr_7fr] gap-14 lg:gap-20">
        <div>
          <Reveal>
            <SectionHead id="ai-title" title={t("title")} body={t("body")} />
            <Link href="/products/maas" className="btn btn-primary btn-shine mt-8">{t("cta")}</Link>
          </Reveal>
          <dl className="mt-12 space-y-7">
            {build.map((b, i) => {
              const Icon = buildIcons[i];
              return (
                <Reveal key={b.title} delay={0.1 + i * 0.08} className="grid grid-cols-[36px_1fr] gap-x-3">
                  <Icon size={22} strokeWidth={1.6} className="text-cobalt mt-0.5" aria-hidden="true" />
                  <dt className="font-semibold">{b.title}</dt>
                  <dd className="col-start-2 text-sm text-muted mt-1 leading-relaxed">{b.body}</dd>
                </Reveal>
              );
            })}
          </dl>
        </div>

        <div className="space-y-5 self-start min-w-0">
        <Reveal delay={0.1}>
          <StreamDemo />
        </Reveal>
        <Reveal delay={0.2} className="rounded-[10px] border border-line overflow-hidden">
          <div className="flex items-center justify-between px-5 h-12 bg-mist border-b border-line">
            <h3 className="text-sm font-semibold">{t("models")}</h3>
            <span className="text-[12px] text-muted">OpenAI-compatible API</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-[12px] text-muted">
                  <th scope="col" className="font-normal px-5 py-3">{t("colName")}</th>
                  <th scope="col" className="font-normal px-3 py-3">{t("colType")}</th>
                  <th scope="col" className="font-normal px-3 py-3 text-right">{t("colCtx")}</th>
                  <th scope="col" className="font-normal px-5 py-3 text-right">{t("colPrice")}</th>
                </tr>
              </thead>
              <tbody>
                {models.map(m => (
                  <tr key={m.name} className="border-t border-line hover:bg-mist/70">
                    <th scope="row" className="text-left font-medium px-5 py-3.5">
                      <span className="figure">{m.name}</span>
                      <span className="block text-[12px] font-normal text-faint">{m.vendor}</span>
                    </th>
                    <td className="px-3 py-3.5 text-muted">{t(`types.${m.type}`)}</td>
                    <td className="px-3 py-3.5 text-right figure text-muted">{m.ctx}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="figure font-semibold">¥{m.price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
