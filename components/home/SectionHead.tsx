export default function SectionHead({ id, title, body, dark = false, aside }: { id?: string; title: string; body?: string; dark?: boolean; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[36em]">
        <h2 id={id} className={`text-[28px] sm:text-[36px] font-semibold tracking-[-0.015em] ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
        {body && <p className={`mt-4 text-[17px] leading-relaxed ${dark ? "text-white/65" : "text-muted"}`}>{body}</p>}
      </div>
      {aside}
    </div>
  );
}
