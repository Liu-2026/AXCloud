"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUp, Headset, MessageSquarePlus, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { AGENT_EVENT } from "@/lib/agent-bus";
import { Mark } from "@/components/site/Logo";

type Msg = { role: "user" | "assistant"; content: string; kind?: "human" };
const STORE = "ax-agent-chat";

export default function AgentWidget() {
  const t = useTranslations("agent");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE);
      if (saved) setMsgs(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs));
    } catch {}
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [msgs]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      const history = [...msgs.filter(m => !m.kind), { role: "user" as const, content: q }];
      setMsgs(m => [...m, { role: "user", content: q }, { role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history, locale }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) throw new Error(String(res.status));
        setOffline(res.headers.get("x-agent-mode") === "offline");
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          const snapshot = acc;
          setMsgs(m => [...m.slice(0, -1), { role: "assistant", content: snapshot }]);
        }
        if (!acc.trim()) throw new Error("empty");
      } catch (e) {
        if ((e as Error).name !== "AbortError") setMsgs(m => [...m.slice(0, -1), { role: "assistant", content: t("error") }]);
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, msgs, locale, t],
  );

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (prompt) setTimeout(() => setInput(prompt), 0);
      setTimeout(() => inputRef.current?.focus(), 50);
    };
    window.addEventListener(AGENT_EVENT, onOpen);
    return () => window.removeEventListener(AGENT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function reset() {
    abortRef.current?.abort();
    setMsgs([]);
    setOffline(false);
    inputRef.current?.focus();
  }

  function human() {
    setMsgs(m => [...m, { role: "user", content: t("human"), kind: "human" }, { role: "assistant", content: t("humanReply"), kind: "human" }]);
  }

  const suggestions = t.raw("suggestions") as string[];

  return (
    <>
      <motion.button
        ref={launcherRef}
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, delay: 1.6 }}
        whileHover={{ y: -2 }}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="ax-agent"
        aria-label={t("launcher")}
        className={`fixed z-[60] right-4 bottom-4 sm:right-6 sm:bottom-6 flex items-center gap-2.5 h-12 pl-2 pr-5 rounded-full bg-night text-white ring-1 ring-white/20 shadow-[0_16px_32px_-12px_rgb(10_26_68/0.6)] hover:bg-night-2 transition-[opacity,transform] ${
          open ? "max-sm:opacity-0 max-sm:pointer-events-none" : ""
        }`}
      >
        <span className="relative grid place-items-center h-8 w-8 rounded-full bg-cobalt">
          {!reduce && !open && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-cobalt"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: 3, repeatDelay: 2.4, delay: 2.4, ease: "easeOut" }}
            />
          )}
          <Headset size={17} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold">{t("launcher")}</span>
      </motion.button>

      <AnimatePresence>
      {open && (
        <motion.section
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{ transformOrigin: "bottom right" }}
          id="ax-agent"
          role="dialog"
          aria-modal="false"
          aria-labelledby="ax-agent-title"
          className="fixed z-[70] inset-0 sm:inset-auto sm:right-6 sm:bottom-[88px] sm:w-[400px] sm:h-[min(640px,calc(100vh-120px))] flex flex-col bg-white sm:rounded-[16px] border border-line shadow-[0_32px_64px_-24px_rgb(10_26_68/0.45)] overflow-hidden"
        >
          <header className="flex items-center gap-3 px-4 h-16 bg-night text-white shrink-0">
            <Mark size={32} />
            <div className="leading-tight min-w-0">
              <h2 id="ax-agent-title" className="font-semibold text-[15px]">{t("title")}</h2>
              <p className="text-[12px] text-white/60 truncate">{t("subtitle")}</p>
            </div>
            <div className="ml-auto flex">
              <button type="button" onClick={reset} aria-label={t("clear")} title={t("clear")} className="p-2 rounded-[6px] text-white/70 hover:text-white hover:bg-white/10">
                <MessageSquarePlus size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => { setOpen(false); launcherRef.current?.focus(); }} aria-label={t("close")} className="p-2 rounded-[6px] text-white/70 hover:text-white hover:bg-white/10">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-mist" aria-live="polite">
            {offline && <p className="text-[12px] text-muted bg-white border border-line rounded-[6px] px-3 py-2">{t("offline")}</p>}
            <Bubble role="assistant">{t("greeting")}</Bubble>
            {msgs.length === 0 && (
              <ul className="flex flex-col items-start gap-2 pl-1" role="list">
                {suggestions.map((s, i) => (
                  <motion.li key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}>
                    <button type="button" onClick={() => send(s)} className="text-left text-[13px] px-3 py-2 rounded-[10px] border border-cobalt/25 bg-white text-cobalt hover:border-cobalt">
                      {s}
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
            {msgs.map((m, i) => (
              <Bubble key={i} role={m.role} pending={busy && i === msgs.length - 1 && !m.content}>
                {m.role === "assistant" ? <Rich text={m.content} /> : m.content}
              </Bubble>
            ))}
          </div>

          <form
            className="shrink-0 border-t border-line p-3 bg-white"
            onSubmit={e => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2 rounded-[10px] border border-line focus-within:border-cobalt focus-within:shadow-[0_0_0_3px_rgb(47_75_255/0.12)] px-3 py-2">
              <label htmlFor="ax-agent-input" className="sr-only">{t("placeholder")}</label>
              <textarea
                id="ax-agent-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={t("placeholder")}
                maxLength={2000}
                className="flex-1 resize-none bg-transparent text-sm leading-6 max-h-28 outline-none py-1"
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label={t("send")} className="grid place-items-center h-8 w-8 rounded-[6px] bg-cobalt text-white disabled:bg-line disabled:text-faint">
                <ArrowUp size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <button type="button" onClick={human} className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-cobalt">
                <Headset size={13} aria-hidden="true" />
                {t("human")}
              </button>
              <span className="text-[11px] text-faint">{t("disclaimer")}</span>
            </div>
          </form>
        </motion.section>
      )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children, pending }: { role: Msg["role"]; children: React.ReactNode; pending?: boolean }) {
  const me = role === "user";
  return (
    <motion.div
      className={`flex ${me ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: me ? "bottom right" : "bottom left" }}
    >
      <div
        className={`max-w-[86%] text-sm leading-relaxed px-3.5 py-2.5 ${
          me ? "bg-cobalt text-white rounded-[10px] rounded-br-[2px]" : "bg-white text-ink border border-line rounded-[10px] rounded-bl-[2px]"
        }`}
      >
        {pending ? (
          <span className="inline-flex gap-1 py-1.5" aria-label="…">
            {[0, 1, 2].map(i => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-faint animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </span>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}

/** 轻量 Markdown：段落、列表、粗体、站内链接 */
function Rich({ text }: { text: string }) {
  const isItem = (l: string) => /^\s*([-*•]|\d+\.)\s+/.test(l);
  const groups: { list: boolean; lines: string[] }[] = [];
  for (const raw of text.trim().split("\n")) {
    const line = raw.replace(/^#+\s*/, "");
    if (!line.trim()) {
      groups.push({ list: false, lines: [] });
      continue;
    }
    const list = isItem(line);
    const last = groups.at(-1);
    if (last && last.list === list && last.lines.length) last.lines.push(line);
    else groups.push({ list, lines: [line] });
  }
  return (
    <div className="space-y-2">
      {groups.filter(g => g.lines.length).map((g, i) =>
        g.list ? (
          <ul key={i} className="space-y-1 pl-4 list-disc marker:text-faint">
            {g.lines.map((l, j) => <li key={j}><Inline text={l.replace(/^\s*([-*•]|\d+\.)\s+/, "")} /></li>)}
          </ul>
        ) : (
          <p key={i}>
            {g.lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <Inline text={l} />
              </Fragment>
            ))}
          </p>
        ),
      )}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return href.startsWith("/") ? (
            <Link key={i} href={href} className="text-cobalt font-medium underline underline-offset-2 decoration-cobalt/30 hover:decoration-cobalt">{label}</Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-cobalt underline underline-offset-2">{label}</a>
          );
        }
        const bold = p.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
