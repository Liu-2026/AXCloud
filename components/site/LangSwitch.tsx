"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LangSwitch({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();
  const next = locale === "zh" ? "en" : "zh";

  function swap() {
    startTransition(() => {
      // @ts-expect-error -- 动态路由参数与当前路径一致
      router.replace({ pathname, params }, { locale: next, scroll: false });
    });
  }

  return (
    <button
      type="button"
      onClick={swap}
      disabled={pending}
      aria-label={t("language")}
      title={t("language")}
      className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-[6px] text-sm transition-colors ${
        dark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-muted hover:text-ink hover:bg-mist"
      } ${pending ? "opacity-60" : ""}`}
    >
      <Languages size={16} strokeWidth={1.75} aria-hidden="true" />
      {!compact && <span>{locale === "zh" ? "EN" : "中文"}</span>}
    </button>
  );
}
