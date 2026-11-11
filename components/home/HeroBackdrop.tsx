"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useActive } from "@/components/motion/primitives";

const RAIL = 56;

type Packet = { x: number; y: number; v: number; len: number; alpha: number; up: boolean };

/** 主视觉背景：数据包沿机柜导轨流动 */
export default function HeroBackdrop() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = useActive(wrap);
  const reduce = useReducedMotion();

  useEffect(() => {
    const c = canvas.current;
    const w = wrap.current;
    if (!c || !w) return;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let packets: Packet[] = [];
    let raf = 0;
    let last = performance.now();

    const spawn = (initial = false): Packet => {
      const rails = Math.floor(width / RAIL);
      const rail = Math.floor(rails * 0.3 + Math.random() * rails * 0.7);
      const up = Math.random() < 0.3;
      return {
        x: rail * RAIL + 0.5,
        y: initial ? Math.random() * height : up ? height + 40 : -40,
        v: 40 + Math.random() * 120,
        len: 24 + Math.random() * 70,
        alpha: 0.25 + Math.random() * 0.55,
        up,
      };
    };

    const resize = () => {
      width = w.clientWidth;
      height = w.clientHeight;
      c.width = width * dpr;
      c.height = height * dpr;
      c.style.width = `${width}px`;
      c.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(width / 60);
      packets = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of packets) {
        p.y += (p.up ? -1 : 1) * p.v * dt;
        const head = p.y;
        const tail = p.up ? p.y + p.len : p.y - p.len;
        const g = ctx.createLinearGradient(0, tail, 0, head);
        g.addColorStop(0, "rgba(120,145,255,0)");
        g.addColorStop(1, `rgba(170,190,255,${p.alpha})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, tail);
        ctx.lineTo(p.x, head);
        ctx.stroke();
        ctx.fillStyle = `rgba(210,220,255,${p.alpha})`;
        ctx.fillRect(p.x - 1, head - 1, 2, 2);
      }
      packets = packets.map(p => ((p.up ? p.y < -p.len - 20 : p.y > height + p.len + 20) ? spawn() : p));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(w);

    if (reduce || !active) {
      draw(0);
    } else {
      const loop = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        draw(dt);
        raf = requestAnimationFrame(loop);
      };
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, reduce]);

  return (
    <div ref={wrap} aria-hidden="true" className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent_25%,#000_70%)]">
      <div
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)", backgroundSize: `${RAIL}px 100%` }}
      />
      <canvas ref={canvas} className="absolute inset-0" />
    </div>
  );
}
