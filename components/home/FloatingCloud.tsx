"use client";

import { motion, useReducedMotion } from "motion/react";

/** 注册区的玻璃云：缓慢上下浮动，底座阴影随之缩放 */
export default function FloatingCloud() {
  const reduce = useReducedMotion();
  return (
    <div className="relative hidden md:block w-[440px] -mr-6 select-none pointer-events-none" aria-hidden="true">
      <motion.img
        src="/hero-cloud.webp"
        alt=""
        width={1536}
        height={1024}
        className="w-full h-auto mix-blend-multiply [mask-image:radial-gradient(ellipse_50%_50%_at_55%_50%,#000_55%,transparent_100%)]"
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
