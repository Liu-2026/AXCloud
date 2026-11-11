"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { areaName, regions, totalZones, type Region } from "@/lib/regions";
import { pick } from "@/lib/site";
import { CountUp, Reveal, ease, useActive } from "@/components/motion/primitives";
import SectionHead from "./SectionHead";

const origin = regions.find(r => r.id === "cn-shanghai")!;
const toAngles = ([lat, lng]: [number, number]) => [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), ((lat * Math.PI) / 180) * 0.6];
/** 自动巡览的顺序：从上海出发依次经过海外地域 */
const tour = ["cn-shanghai", "cn-hongkong", "ap-singapore", "ap-tokyo", "eu-frankfurt", "us-siliconvalley", "me-dubai", "cn-beijing"];
const TOUR_MS = 3800;
const IDLE_MS = 9000;

type Marker = { location: [number, number]; size: number; color?: [number, number, number]; id: string };

/** 标记贴合地表、尺寸固定；选中态的脉冲与标签由 HTML 叠加层负责 */
function markersFor(selId: string): Marker[] {
  return regions.map(x => ({
    id: x.id,
    location: x.loc,
    size: x.id === selId ? 0.045 : x.id === origin.id ? 0.035 : 0.025,
    color: x.id === selId ? [1, 0.38, 0.14] : undefined,
  }));
}
function arcsFor(selId: string) {
  // 骨干网：上海到各海外地域的淡色连线 + 当前地域高亮
  const base = regions
    .filter(r => r.area !== "cn" && r.id !== selId)
    .map(r => ({ from: origin.loc, to: r.loc, color: [0.32, 0.4, 0.75] as [number, number, number] }));
  return selId === origin.id ? base : [...base, { from: origin.loc, to: regions.find(r => r.id === selId)!.loc, color: [1, 0.45, 0.2] as [number, number, number] }];
}

export default function Infra() {
  const t = useTranslations("infra");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const active = useActive(sectionRef);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sel, setSel] = useState<Region>(origin);
  const target = useRef(toAngles(origin.loc));
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lastTouch = useRef(0);
  const selRef = useRef(origin.id);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = canvas.offsetWidth;
    let [phi, theta] = target.current;
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi,
      theta,
      dark: 1,
      diffuse: 0.9,
      mapSamples: 40000,
      mapBrightness: 8,
      mapBaseBrightness: 0,
      baseColor: [0.1, 0.15, 0.36],
      markerColor: [0.5, 0.62, 1],
      glowColor: [0.1, 0.17, 0.45],
      markers: markersFor(origin.id),
      arcs: arcsFor(origin.id),
      arcColor: [0.55, 0.66, 1],
      arcWidth: 0.5,
      arcHeight: 0.28,
      markerElevation: 0,
    });
    globeRef.current = globe;

    let raf = 0;
    let warm = 0;
    const wrap = canvas.parentElement!;
    const root = document.documentElement;
    let lastSel = "";
    let anchor: HTMLElement | null = null;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      // 离开视口时不重绘
      if (!activeRef.current && warm > 120) return;
      const [tp, tt] = target.current;
      let dp = tp - phi;
      dp = Math.atan2(Math.sin(dp), Math.cos(dp));
      const moving = Math.abs(dp) > 0.0005 || Math.abs(tt - theta) > 0.0005;
      const selChanged = lastSel !== selRef.current;
      if (warm++ < 120 || moving || selChanged) {
        phi += dp * 0.06;
        theta += (tt - theta) * 0.06;
        if (selChanged) {
          lastSel = selRef.current;
          globe.update({ phi, theta, markers: markersFor(lastSel) });
        } else {
          globe.update({ phi, theta });
        }
        // cobe 为每个带 id 的标记生成定位节点（按 regions 顺序），叠加层直接跟随它的精确投影位置
        const nodes = wrap.querySelectorAll<HTMLElement>(":scope > div");
        anchor = nodes[regions.findIndex(r => r.id === lastSel)] ?? null;
        const pin = pinRef.current;
        if (pin && anchor) {
          pin.style.left = anchor.style.left;
          pin.style.top = anchor.style.top;
          const visible = root.style.getPropertyValue(`--cobe-visible-${lastSel}`) !== "" || getComputedStyle(root).getPropertyValue(`--cobe-visible-${lastSel}`).trim() === "N";
          pin.style.opacity = visible ? "1" : "0";
          pin.dataset.side = parseFloat(anchor.style.left) > 62 ? "left" : "right";
        }
      }
    };
    raf = requestAnimationFrame(loop);
    canvas.style.opacity = "1";
    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [reduce]);

  function focus(r: Region) {
    setSel(r);
    selRef.current = r.id;
    target.current = toAngles(r.loc);
    globeRef.current?.update({ arcs: arcsFor(r.id), markers: markersFor(r.id) });
  }

  function choose(r: Region) {
    lastTouch.current = Date.now();
    focus(r);
  }

  // 无人操作时自动巡览各地域
  useEffect(() => {
    if (reduce || !active) return;
    const id = window.setInterval(() => {
      if (Date.now() - lastTouch.current < IDLE_MS) return;
      const i = tour.indexOf(selRef.current);
      focus(regions.find(r => r.id === tour[(i + 1) % tour.length])!);
    }, TOUR_MS);
    return () => window.clearInterval(id);
  }, [active, reduce]);

  const groups = (Object.keys(areaName) as Region["area"][]).map(a => ({ area: a, items: regions.filter(r => r.area === a) }));

  return (
    <section ref={sectionRef} id="infra" className="py-24 lg:py-32 bg-night text-white overflow-hidden" aria-labelledby="infra-title">
      <div className="shell grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <Reveal>
            <SectionHead id="infra-title" title={t("title")} body={t("body")} dark />
          </Reveal>
          <dl className="mt-8 flex gap-10">
            <div>
              <dt className="text-[13px] text-white/55">{t("regions")}</dt>
              <dd className="figure text-[32px] font-bold leading-tight"><CountUp value={regions.length} /></dd>
            </div>
            <div>
              <dt className="text-[13px] text-white/55">{t("zones")}</dt>
              <dd className="figure text-[32px] font-bold leading-tight"><CountUp value={totalZones} duration={1.6} /></dd>
            </div>
          </dl>

          <div className="mt-8 space-y-5">
            {groups.map((g, gi) => (
              <Reveal key={g.area} delay={0.1 + gi * 0.07}>
                <h3 className="text-[13px] text-white/55 mb-2">{pick(areaName[g.area], locale)}</h3>
                <ul className="flex flex-wrap gap-1.5" role="list">
                  {g.items.map(r => (
                    <li key={r.id}>
                      <button
                        type="button"
                        aria-pressed={sel.id === r.id}
                        onClick={() => choose(r)}
                        className={`relative h-8 px-3 rounded-[6px] border text-[13px] transition-colors active:scale-[0.97] ${
                          sel.id === r.id ? "border-transparent text-white" : "bg-white/[0.04] border-white/15 text-white/85 hover:border-white/40"
                        }`}
                      >
                        {sel.id === r.id && (
                          <motion.span layoutId="infra-region" aria-hidden="true" className="absolute -inset-px rounded-[6px] bg-cobalt" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                        )}
                        <span className="relative">{pick(r.name, locale).replace(/^.+ · /, "")}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="relative mx-auto aspect-square w-full max-w-[560px]"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease }}
          >
            <div className="absolute inset-0">
              <canvas ref={canvasRef} className="h-full w-full opacity-0 transition-opacity duration-700" aria-hidden="true" />
            </div>
            {/* 选中地域的定位针：位置每帧取自 cobe 的投影结果 */}
            <div ref={pinRef} data-side="right" aria-hidden="true" className="globe-pin group absolute h-0 w-0 transition-opacity duration-300" style={{ left: "50%", top: "50%" }}>
              {!reduce && (
                <>
                  <span className="globe-ring" />
                  <span className="globe-ring" style={{ animationDelay: "0.9s" }} />
                </>
              )}
              <span className="absolute -left-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-[#ff6124] ring-2 ring-white/80" />
              <span className="globe-leader" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={sel.id}
                  className="globe-label"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <span className="block text-[13px] font-semibold text-white whitespace-nowrap">{pick(sel.name, locale).replace(/^.+ · /, "")}</span>
                  <span className="block text-[11px] text-white/60 whitespace-nowrap figure">
                    {sel.zones} {locale === "en" ? "AZs" : "个可用区"} · {sel.rtt} ms
                  </span>
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
          <p className="sr-only" aria-live="polite">
            {pick(sel.name, locale)}：{t("zones")} {sel.zones}，{t("rtt")} {sel.rtt} ms
          </p>
          <p className="mt-4 text-[12px] text-white/40 text-right">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
