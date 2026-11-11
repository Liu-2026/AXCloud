"use client";

import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, BrainCircuit, Database, HardDrive, Info, Plus, Server } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { costTrend, initialInstances, notices, buckets, databases } from "@/lib/console-data";
import { pick } from "@/lib/site";
import { PageHead, Panel } from "./ConsoleShell";
import { CountUp } from "@/components/motion/primitives";

export default function Overview() {
  const t = useTranslations("console");
  const locale = useLocale();
  const monthCost = costTrend.slice(-11).reduce((n, d) => n + d.cost, 0);
  const running = initialInstances.filter(i => i.status === "running").length;

  const stats: { label: string; value: React.ReactNode; action?: React.ReactNode }[] = [
    { label: t("balance"), value: <CountUp value={12486.3} decimals={2} prefix="¥" />, action: <Link href="/console/billing" className="text-[13px] font-semibold text-cobalt hover:underline">{t("recharge")}</Link> },
    { label: t("monthCost"), value: <CountUp value={monthCost} decimals={2} prefix="¥" /> },
    { label: t("runningInstances"), value: `${running} / ${initialInstances.length}` },
    { label: t("alerts"), value: <CountUp value={1} /> },
  ];

  const resources = [
    { icon: Server, label: t("ecs"), count: initialInstances.length, href: "/console/ecs" },
    { icon: HardDrive, label: t("storage"), count: buckets.length, href: "/console/storage" },
    { icon: Database, label: t("database"), count: databases.length, href: "/console/database" },
    { icon: BrainCircuit, label: t("maas"), count: 2, href: "/console/maas" },
  ];

  return (
    <>
      <PageHead
        title={t("welcome")}
        actions={<Link href="/console/ecs?create=1" className="btn btn-primary btn-sm"><Plus size={15} aria-hidden="true" />{t("createInstance")}</Link>}
      />

      <dl className="grid grid-cols-2 xl:grid-cols-4 bg-white rounded-[10px] border border-line mb-6">
        {stats.map((s, i) => (
          <div key={s.label} className={`p-5 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t xl:border-t-0" : ""} xl:[&:not(:first-child)]:border-l border-line`}>
            <dt className="flex items-center justify-between text-[13px] text-muted">{s.label}{s.action}</dt>
            <dd className="mt-2 figure text-[26px] font-bold leading-none">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
        <Panel title={t("costTrend")} actions={<span className="text-[12px] text-muted">CNY</span>}>
          <div className="h-[280px] px-2 pt-4 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f4bff" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#2f4bff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e8ecf4" />
                <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: "#dde3f0" }} tick={{ fontSize: 12, fill: "#8a93a8" }} interval={4} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#8a93a8" }} width={44} tickFormatter={v => `¥${v}`} />
                <Tooltip
                  cursor={{ stroke: "#8a93a8", strokeWidth: 1 }}
                  contentStyle={{ borderRadius: 8, border: "1px solid #dde3f0", fontSize: 13, boxShadow: "0 8px 24px -12px rgb(10 26 68 / 0.3)" }}
                  formatter={v => [`¥${Number(v).toFixed(2)}`, locale === "en" ? "Spend" : "消费"]}
                />
                <Area type="monotone" dataKey="cost" animationDuration={1400} animationEasing="ease-out" stroke="#2f4bff" strokeWidth={2} fill="url(#costFill)" activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title={t("notices")}>
          <ul className="divide-y divide-line" role="list">
            {notices.map(n => (
              <li key={n.zh} className="flex gap-3 px-5 py-4 text-sm">
                {n.level === "warn" ? (
                  <AlertTriangle size={16} className="text-promo shrink-0 mt-0.5" aria-label="warning" />
                ) : (
                  <Info size={16} className="text-cobalt shrink-0 mt-0.5" aria-label="info" />
                )}
                {pick(n, locale)}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title={t("resources")} className="mt-6">
        <ul className="grid sm:grid-cols-2 xl:grid-cols-4" role="list">
          {resources.map(({ icon: Icon, label, count, href }, i) => (
            <li key={href} className={`border-line ${i ? "border-t sm:border-t-0" : ""} ${i % 2 ? "sm:border-l" : ""} ${i > 1 ? "sm:border-t xl:border-t-0" : ""} xl:[&:not(:first-child)]:border-l`}>
              <Link href={href} className="flex items-center gap-4 p-5 hover:bg-mist">
                <span className="grid place-items-center h-10 w-10 rounded-[8px] bg-ice text-cobalt">
                  <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="block figure text-xl font-bold"><CountUp value={count} duration={0.9} /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
