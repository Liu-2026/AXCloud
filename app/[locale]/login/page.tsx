import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";
import Logo from "@/components/site/Logo";
import LangSwitch from "@/components/site/LangSwitch";
import LoginForm from "@/components/site/LoginForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return { title: t("submit") };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("login");
  const points = t.raw("asidePoints") as string[];

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden lg:flex flex-col justify-between bg-night text-white p-12 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50 [mask-image:linear-gradient(180deg,transparent,#000_70%)]"
          style={{ backgroundImage: "linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)", backgroundSize: "56px 100%" }}
        />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-cobalt/25 blur-[140px]" />
        <div className="relative"><Logo dark /></div>
        <div className="relative max-w-[26em]">
          <h2 className="text-[36px] font-semibold leading-tight">{t("asideTitle")}</h2>
          <ul className="mt-8 space-y-3 text-white/75" role="list">
            {points.map(p => (
              <li key={p} className="flex gap-3">
                <Check size={18} className="text-signal shrink-0 mt-1" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[13px] text-white/40">© 2026 AXCloud</p>
      </aside>

      <main id="main" className="flex flex-col">
        <div className="flex items-center justify-between h-16 px-6">
          <span className="lg:hidden"><Logo /></span>
          <span className="ml-auto"><LangSwitch /></span>
        </div>
        <div className="flex-1 grid place-items-center px-6 pb-16">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
