"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useActive } from "@/components/motion/primitives";

type Sample = { model: string; q: string; a: string; ttft: number; price: number };

const samples: Record<"zh" | "en", Sample[]> = {
  zh: [
    { model: "deepseek-v3", q: "用一句话解释什么是负载均衡", a: "负载均衡把进来的请求分发到多台服务器上，避免单台过载；某台出故障时自动绕开它，服务因此保持稳定。", ttft: 0.38, price: 2 },
    { model: "qwen3-coder", q: "把订单表改成按月统计金额", a: "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,\n       SUM(amount) AS total\nFROM orders\nGROUP BY month\nORDER BY month;", ttft: 0.31, price: 4 },
    { model: "kimi-k2", q: "写一条双 11 促销短信，40 字以内", a: "【安信商城】双 11 狂欢开启！全场满 300 减 50，爆款低至 5 折，点击链接立即抢购。退订回 T", ttft: 0.42, price: 4 },
  ],
  en: [
    { model: "deepseek-v3", q: "Explain load balancing in one sentence", a: "A load balancer spreads incoming requests across several servers so none is overloaded, and routes around any server that fails, keeping the service up.", ttft: 0.38, price: 2 },
    { model: "qwen3-coder", q: "Sum order amounts by month", a: "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,\n       SUM(amount) AS total\nFROM orders\nGROUP BY month\nORDER BY month;", ttft: 0.31, price: 4 },
    { model: "kimi-k2", q: "Write a 20-word sale SMS for 11.11", a: "AX Mall 11.11 is live! ¥50 off every ¥300, bestsellers up to 50% off. Tap the link to shop now.", ttft: 0.42, price: 4 },
  ],
};

/** 把回答切成“token”：中文 1–3 字，英文按词 */
function tokenize(text: string) {
  const out: string[] = [];
  const re = /[一-鿿]{1,2}|[A-Za-z0-9_'%-]+|\s+|./g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[0]);
  return out;
}

export default function StreamDemo() {
  const locale = useLocale() === "en" ? "en" : "zh";
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"wait" | "stream" | "done">("wait");
  const sample = samples[locale][idx];
  const tokens = tokenize(sample.a);

  useEffect(() => {
    if (reduce) {
      setShown(tokens.length);
      setPhase("done");
      return;
    }
    if (!active) return;
    let t: number;
    let i = shown;
    if (phase === "wait") {
      t = window.setTimeout(() => setPhase("stream"), sample.ttft * 1000 + 300);
    } else if (phase === "stream") {
      const tick = () => {
        i += 1;
        setShown(i);
        if (i >= tokens.length) setPhase("done");
        else t = window.setTimeout(tick, 28 + Math.random() * 50);
      };
      t = window.setTimeout(tick, 40);
    } else {
      t = window.setTimeout(() => {
        setShown(0);
        setPhase("wait");
        setIdx(n => (n + 1) % samples[locale].length);
      }, 3200);
    }
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, active, reduce, idx]);

  const text = tokens.slice(0, shown).join("");
  const outTokens = Math.round(shown * 1.3);
  const cost = ((sample.q.length + outTokens) / 1_000_000) * sample.price;

  return (
    <div ref={ref} className="rounded-[10px] bg-night text-white overflow-hidden border border-night-line" aria-label={locale === "en" ? "Streaming API example" : "流式调用示例"}>
      <div className="flex items-center gap-3 px-5 h-11 border-b border-night-line text-[12px]">
        <span className="font-mono text-white/55">POST /v1/chat/completions</span>
        <span className="ml-auto flex gap-1">
          {samples[locale].map((s, i) => (
            <span key={s.model} className={`relative px-2 h-6 inline-flex items-center rounded-[4px] font-mono transition-colors ${i === idx ? "text-white" : "text-white/40"}`}>
              {i === idx && <motion.span layoutId="stream-model" className="absolute inset-0 rounded-[4px] bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{s.model}</span>
            </span>
          ))}
        </span>
      </div>
      <div className="px-5 py-4 min-h-[188px] text-[13px] leading-relaxed">
        <AnimatePresence mode="wait">
          <motion.div key={`${locale}-${idx}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
            <p className="text-white/50">
              <span className="text-[#8fa3ff] font-mono mr-2">user</span>
              {sample.q}
            </p>
            <div className="mt-3 flex">
              <span className="text-signal font-mono mr-2 shrink-0">assistant</span>
              <p className={`whitespace-pre-wrap ${sample.model === "qwen3-coder" ? "font-mono text-[12px]" : ""}`}>
                {text}
                {phase !== "done" && <span className="inline-block w-[7px] h-[14px] -mb-[2px] ml-0.5 bg-white/80 animate-pulse" aria-hidden="true" />}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-5 px-5 h-10 border-t border-night-line text-[12px] text-white/50 figure">
        <span>{locale === "en" ? "TTFT" : "首字延迟"} <span className="text-white/85">{phase === "wait" ? "—" : `${sample.ttft.toFixed(2)}s`}</span></span>
        <span>tokens <span className="text-white/85">{outTokens}</span></span>
        <span className="ml-auto">¥<span className="text-white/85">{cost.toFixed(5)}</span></span>
      </div>
    </div>
  );
}
