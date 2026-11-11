import { Link } from "@/i18n/navigation";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#2f4bff" />
      <path d="M8 22.5 16 8l8 14.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 18.5h9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

export default function Logo({ dark = false, href = "/" }: { dark?: boolean; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0" aria-label="安信云 AXCloud">
      <Mark />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className={`text-[19px] font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`}>安信云</span>
        <span className={`figure text-[13px] font-semibold ${dark ? "text-white/60" : "text-faint"}`}>AXCloud</span>
      </span>
    </Link>
  );
}
