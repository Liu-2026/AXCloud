"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, MotionConfig, useInView, useReducedMotion, type HTMLMotionProps } from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

/** 全站动效配置：系统开启“减少动态效果”时自动关闭位移类动画 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease }}>
      {children}
    </MotionConfig>
  );
}

/** 滚动进入视口时上浮淡入，只播放一次 */
export function Reveal({ children, delay = 0, y = 24, className, ...rest }: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** 子元素依次进入 */
export const stagger = {
  parent: {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  },
  child: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  },
};

/** 数字滚动：fromZero 时进入视口从 0 计到目标值；之后值变化时平滑过渡 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.2, fromZero = true, className }: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; fromZero?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(fromZero ? 0 : value);
  const current = useRef(shown);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      current.current = value;
      setShown(value);
      return;
    }
    const first = current.current === 0;
    const controls = animate(current.current, value, {
      duration: first ? duration : 0.45,
      ease,
      onUpdate: v => {
        current.current = v;
        setShown(v);
      },
    });
    return () => controls.stop();
  }, [value, inView, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** 元素在视口内且页面可见时为 true，用于暂停离屏的循环动画 */
export function useActive<T extends Element>(ref: React.RefObject<T | null>) {
  const inView = useInView(ref, { amount: 0.15 });
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const on = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);
  return inView && visible;
}
