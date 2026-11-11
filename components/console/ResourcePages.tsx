"use client";

import { useLocale, useTranslations } from "next-intl";
import { Copy, Plus } from "lucide-react";
import { apiKeys, bills, buckets, databases, tickets } from "@/lib/console-data";
import { regions } from "@/lib/regions";
import { pick } from "@/lib/site";
import { PageHead, Panel, StatusDot } from "./ConsoleShell";

function useRegionName() {
  const locale = useLocale();
  return (id: string) => {
    const r = regions.find(x => x.id === id);
    return r ? pick(r.name, locale) : id;
  };
}

function Table({ head, children, min = 720 }: { head: string[]; children: React.ReactNode; min?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ minWidth: min }}>
        <thead className="text-left text-[12px] text-muted bg-mist">
          <tr>
            {head.map((h, i) => (
              <th key={h} scope="col" className={`font-normal py-2.5 ${i === 0 ? "px-5" : "px-3"} ${i === head.length - 1 ? "pr-5" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

const create = (label: string) => (
  <button type="button" className="btn btn-primary btn-sm">
    <Plus size={15} aria-hidden="true" />
    {label}
  </button>
);

export function StoragePage() {
  const t = useTranslations("console");
  const rn = useRegionName();
  const locale = useLocale();
  return (
    <>
      <PageHead title={t("storage")} actions={create(locale === "en" ? "Create bucket" : "创建存储桶")} />
      <Panel>
        <Table head={[t("bucket"), t("region"), t("objects"), t("size"), t("created")]}>
          {buckets.map(b => (
            <tr key={b.name} className="border-t border-line">
              <th scope="row" className="text-left font-medium px-5 py-3.5 text-cobalt figure">{b.name}</th>
              <td className="px-3 py-3.5 text-muted">{rn(b.region)}</td>
              <td className="px-3 py-3.5 figure">{b.objects.toLocaleString()}</td>
              <td className="px-3 py-3.5 figure">{b.size}</td>
              <td className="px-3 pr-5 py-3.5 figure text-muted">{b.created}</td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}

export function DatabasePage() {
  const t = useTranslations("console");
  const rn = useRegionName();
  const locale = useLocale();
  return (
    <>
      <PageHead title={t("database")} actions={create(locale === "en" ? "Create instance" : "创建实例")} />
      <Panel>
        <Table head={[t("name"), t("engine"), t("spec"), t("region"), t("status")]}>
          {databases.map(d => (
            <tr key={d.name} className="border-t border-line">
              <th scope="row" className="text-left font-medium px-5 py-3.5 text-cobalt figure">{d.name}</th>
              <td className="px-3 py-3.5 figure">{d.engine}</td>
              <td className="px-3 py-3.5 figure text-muted">{d.spec}</td>
              <td className="px-3 py-3.5 text-muted">{rn(d.region)}</td>
              <td className="px-3 pr-5 py-3.5"><StatusDot status={d.status} label={t(d.status)} /></td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}

export function MaasPage() {
  const t = useTranslations("console");
  const locale = useLocale();
  return (
    <>
      <PageHead title={t("maas")} actions={create(locale === "en" ? "Create API key" : "创建 API Key")} />
      <dl className="grid grid-cols-2 bg-white rounded-[10px] border border-line mb-6">
        <div className="p-5">
          <dt className="text-[13px] text-muted">{t("tokensUsed")}</dt>
          <dd className="mt-2 figure text-[26px] font-bold leading-none">43.6M</dd>
        </div>
        <div className="p-5 border-l border-line">
          <dt className="text-[13px] text-muted">{t("callCount")}</dt>
          <dd className="mt-2 figure text-[26px] font-bold leading-none">192,152</dd>
        </div>
      </dl>
      <Panel title={t("apiKeys")}>
        <Table head={[t("name"), "Key", t("callCount"), t("tokensUsed"), t("created")]}>
          {apiKeys.map(k => (
            <tr key={k.name} className="border-t border-line">
              <th scope="row" className="text-left font-medium px-5 py-3.5">{k.name}</th>
              <td className="px-3 py-3.5 figure text-muted">
                {k.key}
                <button type="button" aria-label="Copy" className="ml-2 align-middle text-faint hover:text-cobalt"><Copy size={13} aria-hidden="true" /></button>
              </td>
              <td className="px-3 py-3.5 figure">{k.calls.toLocaleString()}</td>
              <td className="px-3 py-3.5 figure">{k.tokens}</td>
              <td className="px-3 pr-5 py-3.5 figure text-muted">{k.created}</td>
            </tr>
          ))}
        </Table>
      </Panel>
      <Panel title={locale === "en" ? "Quick start" : "快速开始"} className="mt-6">
        <pre className="m-5 p-4 rounded-[8px] bg-night text-white/85 text-[13px] leading-relaxed overflow-x-auto font-mono">{`curl https://api.axcloud.example/v1/chat/completions \\
  -H "Authorization: Bearer $AX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "deepseek-v3", "messages": [{"role": "user", "content": "你好"}]}'`}</pre>
      </Panel>
    </>
  );
}

export function BillingPage() {
  const t = useTranslations("console");
  const locale = useLocale();
  return (
    <>
      <PageHead title={t("billing")} actions={<button type="button" className="btn btn-primary btn-sm">{t("recharge")}</button>} />
      <dl className="grid grid-cols-2 bg-white rounded-[10px] border border-line mb-6">
        <div className="p-5">
          <dt className="text-[13px] text-muted">{t("balance")}</dt>
          <dd className="mt-2 figure text-[26px] font-bold leading-none">¥12,486.30</dd>
        </div>
        <div className="p-5 border-l border-line">
          <dt className="text-[13px] text-muted">{t("unpaid")}</dt>
          <dd className="mt-2 figure text-[26px] font-bold leading-none">¥1,242.30</dd>
        </div>
      </dl>
      <Panel title={t("bill")}>
        <Table head={[t("period"), t("product"), t("amount"), t("status")]} min={560}>
          {bills.map((b, i) => (
            <tr key={i} className="border-t border-line">
              <td className="px-5 py-3.5 figure">{b.period}</td>
              <th scope="row" className="text-left font-normal px-3 py-3.5">{pick(b.product, locale)}</th>
              <td className="px-3 py-3.5 figure font-semibold">¥{b.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="px-3 pr-5 py-3.5"><StatusDot status={b.paid ? "paid" : "unpaid"} label={b.paid ? t("paid") : t("unpaid")} /></td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}

export function TicketsPage() {
  const t = useTranslations("console");
  const locale = useLocale();
  return (
    <>
      <PageHead title={t("tickets")} actions={create(t("newTicket"))} />
      <Panel>
        <Table head={["ID", t("ticketTitle"), t("status"), t("updated")]} min={640}>
          {tickets.map(k => (
            <tr key={k.id} className="border-t border-line">
              <td className="px-5 py-3.5 figure text-muted">{k.id}</td>
              <th scope="row" className="text-left font-medium px-3 py-3.5 text-cobalt">{pick(k.title, locale)}</th>
              <td className="px-3 py-3.5"><StatusDot status={k.status} label={t(k.status)} /></td>
              <td className="px-3 pr-5 py-3.5 figure text-muted">{k.updated}</td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
