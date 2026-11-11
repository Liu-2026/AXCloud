"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Check, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { regions } from "@/lib/regions";
import { pick } from "@/lib/site";
import { CountUp, ease } from "@/components/motion/primitives";
import HeroBackdrop from "./HeroBackdrop";

const heroRegions = ["cn-beijing", "cn-shanghai", "cn-shenzhen", "cn-hongkong", "ap-singapore"];
export const specs = [
  { id: "2c4g", cpu: 2, mem: 4, month: 68 },
  { id: "4c8g", cpu: 4, mem: 8, month: 136 },
  { id: "8c16g", cpu: 8, mem: 16, month: 272 },
  { id: "16c32g", cpu: 16, mem: 32, month: 544 },
];
const images = ["Ubuntu 24.04", "Debian 12", "Rocky Linux 9", "Windows Server 2022"];
const stepKeys = ["allocate", "disk", "boot", "running"] as const;

export function priceFor(specId: string, regionId: string, billing: "month" | "hour") {
  const spec = specs.find(s => s.id === specId)!;
  const factor = regionId.startsWith("cn-") && regionId !== "cn-hongkong" ? 1 : 1.25;
  const month = spec.month * factor;
  return billing === "month" ? month : (month / 720) * 1.3;
}

function fakeIp(regionId: string) {
  let h = 0;
  for (const c of regionId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `47.${100 + (h % 120)}.${(h >> 8) % 250}.${(h >> 16) % 250}`;
}

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [region, setRegion] = useState("cn-shanghai");
  const [spec, setSpec] = useState("4c8g");
  const [image, setImage] = useState(images[0]);
  const [billing, setBilling] = useState<"month" | "hour">("month");
  const [step, setStep] = useState(-1);
  const [run, setRun] = useState({ n: 0, fast: false });
  const firstRun = useRef(true);

  // 开通过程演示：首次加载完整播放；之后修改配置时快速重播
  useEffect(() => {
    if (reduce) {
      setStep(stepKeys.length - 1);
      return;
    }
    setStep(-1);
    const start = run.fast ? 120 : firstRun.current ? 1500 : 500;
    const gap = run.fast ? 260 : 650;
    firstRun.current = false;
    const timers = stepKeys.map((_, i) => window.setTimeout(() => setStep(i), start + i * gap));
    return () => timers.forEach(window.clearTimeout);
  }, [run, reduce]);

  const replay = (fast: boolean) => setRun(r => ({ n: r.n + 1, fast }));
  const choose = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    replay(true);
  };

  const price = priceFor(spec, region, billing);
  const r = regions.find(x => x.id === region)!;
  const done = step >= stepKeys.length - 1;
  const ip = useMemo(() => fakeIp(region), [region]);
  const lines = t("title").split("\n");

  return (
    <section className="relative bg-night text-white overflow-hidden" aria-labelledby="hero-title">
      <HeroBackdrop />
      <motion.div
        aria-hidden="true"
        className="absolute -right-40 top-10 h-[620px] w-[620px] rounded-full bg-cobalt/25 blur-[140px]"
        animate={reduce ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="shell relative grid lg:grid-cols-[1fr_520px] gap-14 lg:gap-20 pt-16 pb-36 lg:pt-24 lg:pb-44 items-center">
        <div>
          <h1 id="hero-title" className="text-[36px] sm:text-[48px] xl:text-[60px] font-semibold leading-[1.18] tracking-[-0.02em]">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-[34em] text-lg text-white/70 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            {t("body")}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease }}
          >
            <Link href="/login?mode=signup" className="btn btn-primary btn-shine h-12 px-7 text-[15px]">{t("primary")}</Link>
            <Link href="/products" className="btn btn-on-dark h-12 px-7 text-[15px]">{t("secondary")}</Link>
          </motion.div>
        </div>

        {/* 开通演示面板 */}
        <motion.div
          className="relative rounded-[16px] bg-white text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)]"
          role="group"
          aria-labelledby="panel-title"
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          style={{ transformPerspective: 1200 }}
        >
          <div className="flex items-center justify-between px-6 h-14 border-b border-line">
            <h2 id="panel-title" className="text-[15px] font-semibold">{t("panelTitle")}</h2>
            <div className="seg relative" role="group" aria-label={t("billing")}>
              {(["month", "hour"] as const).map(b => (
                <button key={b} type="button" aria-pressed={billing === b} onClick={() => setBilling(b)} className="relative !bg-transparent !shadow-none">
                  {billing === b && (
                    <motion.span layoutId="hero-billing" className="absolute inset-0 rounded-[4px] bg-white shadow-[0_1px_2px_rgb(10_26_68/0.12)]" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                  )}
                  <span className="relative">{b === "month" ? t("monthly") : t("hourly")}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            <Row label={t("region")}>
              <div className="flex flex-wrap gap-1.5">
                {heroRegions.map(id => {
                  const reg = regions.find(x => x.id === id)!;
                  return (
                    <Chip key={id} group="hero-region" on={region === id} onClick={() => choose(setRegion)(id)}>
                      {pick(reg.name, locale).replace(/^.+ · /, "")}
                    </Chip>
                  );
                })}
              </div>
            </Row>
            <Row label={t("spec")}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {specs.map(s => (
                  <Chip key={s.id} group="hero-spec" on={spec === s.id} onClick={() => choose(setSpec)(s.id)} wide>
                    <span className="figure">{s.cpu}C {s.mem}G</span>
                  </Chip>
                ))}
              </div>
            </Row>
            <Row label={t("image")}>
              <label className="sr-only" htmlFor="hero-image">{t("image")}</label>
              <select id="hero-image" value={image} onChange={e => choose(setImage)(e.target.value)} className="field h-9 text-[13px]">
                {images.map(i => <option key={i}>{i}</option>)}
              </select>
            </Row>
          </div>

          {/* 开通进度 */}
          <div className="relative mx-6 mb-5 rounded-[10px] bg-mist border border-line overflow-hidden">
            <motion.div
              aria-hidden="true"
              className={`absolute left-0 top-0 h-[2px] ${done ? "bg-signal" : "bg-cobalt"}`}
              initial={false}
              animate={{ width: `${((step + 1) / stepKeys.length) * 100}%` }}
              transition={{ duration: run.fast ? 0.25 : 0.6, ease }}
            />
            <ol className="px-4 py-3 space-y-1.5" aria-live="polite">
              {stepKeys.map((k, i) => {
                const state = i < step || (i === step && done) ? "done" : i === step ? "active" : "wait";
                const last = k === "running";
                return (
                  <li key={k} className={`flex items-center gap-2.5 text-[13px] transition-colors duration-300 ${state === "wait" ? "text-faint" : "text-ink"}`}>
                    <span
                      className={`relative grid place-items-center h-4 w-4 rounded-full border transition-colors duration-300 ${
                        state === "done" ? (last ? "bg-signal border-signal" : "bg-cobalt border-cobalt") : state === "active" ? "border-cobalt" : "border-line bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      <AnimatePresence>
                        {state === "done" && (
                          <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 20 }}>
                            <Check size={10} strokeWidth={3} className="text-white" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {state === "active" && <span className="h-1.5 w-1.5 rounded-full bg-cobalt animate-pulse" />}
                      {last && state === "done" && !reduce && (
                        <motion.span
                          className="absolute inset-0 rounded-full border border-signal"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 2.6, opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                    </span>
                    <span className={last && state === "done" ? "font-semibold text-signal" : ""}>{t(`steps.${k}`)}</span>
                    <AnimatePresence>
                      {last && state === "done" && (
                        <motion.span
                          className="ml-auto flex gap-4 text-muted"
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease }}
                        >
                          <span><span className="hidden sm:inline">{t("ip")} </span><span className="figure text-ink">{ip}</span></span>
                          <span className="hidden sm:inline">{t("latency")} <span className="figure text-ink">{r.rtt} ms</span></span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex items-center gap-4 px-6 h-[76px] border-t border-line">
            <div className="leading-tight">
              <div className="text-[12px] text-muted">{t("estimate")}</div>
              <div className="text-promo">
                <span className="text-sm font-semibold">¥</span>
                <CountUp className="figure text-[28px] font-bold" value={price} decimals={billing === "month" ? 0 : 2} fromZero={false} />
                <span className="text-[13px] text-muted ml-1">{billing === "month" ? (locale === "zh" ? "/月" : "/mo") : (locale === "zh" ? "/小时" : "/hr")}</span>
              </div>
            </div>
            <button type="button" onClick={() => replay(false)} className="group ml-auto inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-cobalt">
              <RotateCcw size={13} aria-hidden="true" className="transition-transform duration-500 group-hover:-rotate-180" />
              {t("replay")}
            </button>
            <Link href={`/console/ecs?create=1&region=${region}&spec=${spec}`} className="btn btn-primary btn-shine">{t("create")}</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[56px_1fr] items-start gap-3">
      <span className="text-[13px] text-muted pt-[7px]">{label}</span>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children, wide, group }: { on: boolean; onClick: () => void; children: React.ReactNode; wide?: boolean; group: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`relative h-9 ${wide ? "px-1 whitespace-nowrap" : "px-3"} rounded-[6px] border text-[13px] transition-colors active:scale-[0.97] ${
        on ? "border-transparent text-cobalt font-semibold" : "border-line text-ink hover:border-cobalt/50"
      }`}
    >
      {on && (
        <motion.span
          layoutId={group}
          aria-hidden="true"
          className="absolute -inset-px rounded-[6px] border border-cobalt bg-ice"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
