"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Plus, Search, Terminal, X } from "lucide-react";
import { initialInstances, type Instance } from "@/lib/console-data";
import { regions } from "@/lib/regions";
import { pick } from "@/lib/site";
import { priceFor, specs } from "@/components/home/Hero";
import { PageHead, Panel, StatusDot } from "./ConsoleShell";

const images = ["Ubuntu 24.04", "Debian 12", "Rocky Linux 9", "Windows Server 2022"];

export default function EcsPage() {
  const t = useTranslations("console");
  const locale = useLocale();
  const params = useSearchParams();
  const [list, setList] = useState<Instance[]>(initialInstances);
  const [q, setQ] = useState("");
  const [wizard, setWizard] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (params.get("create")) setWizard(true);
  }, [params]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? list.filter(i => `${i.name} ${i.id} ${i.ip} ${i.privateIp}`.toLowerCase().includes(term)) : list;
  }, [list, q]);

  const regionName = (id: string) => {
    const r = regions.find(x => x.id === id);
    return r ? pick(r.name, locale) : id;
  };

  function setStatus(id: string, status: Instance["status"]) {
    setList(l => l.map(i => (i.id === id ? { ...i, status, ip: status === "stopped" ? i.ip : i.ip } : i)));
  }

  function power(i: Instance) {
    if (i.status === "running") {
      setStatus(i.id, "stopped");
    } else {
      setStatus(i.id, "starting");
      setTimeout(() => setStatus(i.id, "running"), 2200);
    }
  }

  function created(inst: Instance) {
    setList(l => [inst, ...l]);
    setWizard(false);
    setToast(t("wizard.created"));
    setTimeout(() => setStatus(inst.id, "running"), 2600);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <>
      <PageHead
        title={t("ecs")}
        actions={
          <button type="button" onClick={() => setWizard(true)} className="btn btn-primary btn-sm">
            <Plus size={15} aria-hidden="true" />
            {t("createInstance")}
          </button>
        }
      />
      <Panel>
        <div className="flex items-center gap-3 p-4 border-b border-line">
          <label className="relative w-full max-w-[320px]">
            <span className="sr-only">{t("filter")}</span>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("filter")} className="field h-9 pl-9 text-[13px]" />
          </label>
          <span className="ml-auto text-[13px] text-muted figure">{rows.length} / {list.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[880px]">
            <thead className="text-left text-[12px] text-muted bg-mist">
              <tr>
                <th scope="col" className="font-normal px-5 py-2.5">{t("name")}</th>
                <th scope="col" className="font-normal px-3 py-2.5">{t("status")}</th>
                <th scope="col" className="font-normal px-3 py-2.5">{t("region")}</th>
                <th scope="col" className="font-normal px-3 py-2.5">{t("spec")}</th>
                <th scope="col" className="font-normal px-3 py-2.5">{t("ip")}</th>
                <th scope="col" className="font-normal px-3 py-2.5">{t("expire")}</th>
                <th scope="col" className="font-normal px-5 py-2.5 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-muted">
                    {t("empty")}{" "}
                    <button type="button" onClick={() => setWizard(true)} className="text-cobalt font-semibold hover:underline">{t("createFirst")}</button>
                  </td>
                </tr>
              )}
              {rows.map(i => (
                <tr key={i.id} className="border-t border-line hover:bg-mist/60">
                  <th scope="row" className="text-left font-medium px-5 py-3">
                    <span className="text-cobalt">{i.name}</span>
                    <span className="block text-[12px] font-normal text-faint figure">{i.id}</span>
                  </th>
                  <td className="px-3 py-3"><StatusDot status={i.status} label={t(i.status)} /></td>
                  <td className="px-3 py-3 text-muted">{regionName(i.region)}</td>
                  <td className="px-3 py-3">
                    <span className="figure">{i.spec}</span>
                    <span className="block text-[12px] text-faint">{i.os}</span>
                  </td>
                  <td className="px-3 py-3 figure text-[13px]">
                    {i.status === "stopped" ? "—" : i.ip}
                    <span className="block text-faint">{i.privateIp}</span>
                  </td>
                  <td className="px-3 py-3 figure text-[13px] text-muted">{i.expire}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button type="button" disabled={i.status !== "running"} className="inline-flex items-center gap-1 text-[13px] text-cobalt hover:underline disabled:text-faint disabled:no-underline mr-4">
                      <Terminal size={13} aria-hidden="true" />
                      {t("remoteConnect")}
                    </button>
                    <button type="button" disabled={i.status === "starting"} onClick={() => power(i)} className="text-[13px] text-cobalt hover:underline disabled:text-faint">
                      {i.status === "running" ? t("stop") : t("start")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {wizard && (
        <CreateWizard
          initialRegion={params.get("region") ?? "cn-shanghai"}
          initialSpec={params.get("spec") ?? "2c4g"}
          onClose={() => setWizard(false)}
          onCreate={created}
        />
      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-night text-white text-sm px-4 py-3 rounded-[8px] shadow-lg">
          <CheckCircle2 size={16} className="text-signal" aria-hidden="true" />
          {toast}
        </div>
      )}
    </>
  );
}

function CreateWizard({ initialRegion, initialSpec, onClose, onCreate }: { initialRegion: string; initialSpec: string; onClose: () => void; onCreate: (i: Instance) => void }) {
  const t = useTranslations("console.wizard");
  const th = useTranslations("hero");
  const locale = useLocale();
  const [billing, setBilling] = useState<"month" | "hour">("month");
  const [region, setRegion] = useState(regions.some(r => r.id === initialRegion) ? initialRegion : "cn-shanghai");
  const [spec, setSpec] = useState(specs.some(s => s.id === initialSpec) ? initialSpec : "2c4g");
  const [image, setImage] = useState(images[0]);
  const [disk, setDisk] = useState(40);
  const [bw, setBw] = useState(5);
  const [count, setCount] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const unit = priceFor(spec, region, billing) + (billing === "month" ? (disk - 40) * 0.5 + bw * 18 : ((disk - 40) * 0.5 + bw * 18) / 720 * 1.3);
  const total = unit * count;
  const s = specs.find(x => x.id === spec)!;

  function submit() {
    const id = `i-${Math.random().toString(36).slice(2, 12)}`;
    onCreate({
      id,
      name: `ecs-${id.slice(-4)}`,
      status: "starting",
      region,
      spec: `${s.cpu}C${s.mem}G`,
      ip: `47.${100 + Math.floor(Math.random() * 120)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
      privateIp: `172.16.0.${20 + Math.floor(Math.random() * 200)}`,
      expire: billing === "month" ? "2026-12-11" : "—",
      os: image,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-night/40" onClick={onClose} />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="wiz-title" className="relative w-full max-w-[640px] h-full bg-white flex flex-col outline-none shadow-2xl">
        <div className="flex items-center justify-between h-14 px-6 border-b border-line shrink-0">
          <h2 id="wiz-title" className="text-lg font-semibold">{t("title")}</h2>
          <button type="button" onClick={onClose} aria-label={t("cancel")} className="p-1.5 rounded-[6px] hover:bg-mist"><X size={18} aria-hidden="true" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          <Field label={t("billing")}>
            <div className="seg" role="group" aria-label={t("billing")}>
              <button type="button" aria-pressed={billing === "month"} onClick={() => setBilling("month")}>{th("monthly")}</button>
              <button type="button" aria-pressed={billing === "hour"} onClick={() => setBilling("hour")}>{th("hourly")}</button>
            </div>
          </Field>
          <Field label={t("region")}>
            <div className="flex flex-wrap gap-1.5">
              {regions.map(r => (
                <Opt key={r.id} on={region === r.id} onClick={() => setRegion(r.id)}>{pick(r.name, locale)}</Opt>
              ))}
            </div>
          </Field>
          <Field label={t("spec")}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {specs.map(x => (
                <Opt key={x.id} on={spec === x.id} onClick={() => setSpec(x.id)}>
                  <span className="figure font-semibold block">{x.cpu} vCPU</span>
                  <span className="figure text-[12px] opacity-75">{x.mem} GB</span>
                </Opt>
              ))}
            </div>
          </Field>
          <Field label={t("image")}>
            <div className="flex flex-wrap gap-1.5">
              {images.map(i => <Opt key={i} on={image === i} onClick={() => setImage(i)}>{i}</Opt>)}
            </div>
          </Field>
          <Field label={t("disk")}>
            <Range value={disk} min={40} max={500} step={10} onChange={setDisk} unit="GB" label={t("disk")} />
          </Field>
          <Field label={t("bandwidth")}>
            <Range value={bw} min={1} max={100} step={1} onChange={setBw} unit="Mbps" label={t("bandwidth")} />
          </Field>
          <Field label={t("count")}>
            <div className="inline-flex items-center border border-line rounded-[6px]">
              <button type="button" onClick={() => setCount(c => Math.max(1, c - 1))} className="h-9 w-9 text-lg" aria-label="-">−</button>
              <span className="w-10 text-center figure" aria-live="polite">{count}</span>
              <button type="button" onClick={() => setCount(c => Math.min(20, c + 1))} className="h-9 w-9 text-lg" aria-label="+">+</button>
            </div>
          </Field>
        </div>
        <div className="flex items-center gap-4 h-20 px-6 border-t border-line shrink-0">
          <div>
            <div className="text-[12px] text-muted">{t("total")}</div>
            <div className="text-promo">
              ¥<span className="figure text-[26px] font-bold">{billing === "month" ? total.toFixed(2) : total.toFixed(3)}</span>
              <span className="text-[13px] text-muted ml-1">{billing === "month" ? (locale === "en" ? "/mo" : "/月") : (locale === "en" ? "/hr" : "/小时")}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost ml-auto">{t("cancel")}</button>
          <button type="button" onClick={submit} className="btn btn-primary">{t("confirm")}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid sm:grid-cols-[96px_1fr] gap-3 items-start">
      <legend className="sr-only">{label}</legend>
      <span className="text-sm text-muted pt-2" aria-hidden="true">{label}</span>
      {children}
    </fieldset>
  );
}

function Opt({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-9 px-3 py-1.5 rounded-[6px] border text-[13px] text-left transition-colors ${
        on ? "border-cobalt bg-ice text-cobalt" : "border-line hover:border-cobalt/50"
      }`}
    >
      {children}
    </button>
  );
}

function Range({ value, min, max, step, onChange, unit, label }: { value: number; min: number; max: number; step: number; onChange: (n: number) => void; unit: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="flex-1 accent-cobalt" />
      <span className="w-24 text-right figure text-sm">{value} {unit}</span>
    </div>
  );
}
