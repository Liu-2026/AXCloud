"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";

export default function LoginForm() {
  const t = useTranslations("login");
  const tc = useTranslations("common");
  const router = useRouter();
  const params = useSearchParams();
  const signup = params.get("mode") === "signup";
  const [account, setAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ account?: string; pwd?: string }>({});
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = { account: account.trim() ? undefined : t("required"), pwd: pwd ? undefined : t("pwdRequired") };
    setErrors(next);
    if (next.account || next.pwd) return;
    setBusy(true);
    // 演示环境：不校验凭据，直接进入控制台
    setTimeout(() => router.push("/console"), 500);
  }

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-[28px] font-semibold">{signup ? tc("signup") : t("title")}</h1>
      <p className="mt-2 text-muted">{t("subtitle")}</p>
      <p className="mt-6 text-[13px] bg-ice text-cobalt rounded-[6px] px-3 py-2">{t("demo")}</p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="account" className="block text-sm font-medium mb-1.5">{t("account")}</label>
          <input
            id="account"
            autoComplete="username"
            value={account}
            onChange={e => setAccount(e.target.value)}
            aria-invalid={!!errors.account}
            aria-describedby={errors.account ? "account-err" : undefined}
            className={`field ${errors.account ? "border-promo" : ""}`}
          />
          {errors.account && <p id="account-err" className="mt-1.5 text-[13px] text-[#d8430f]">{errors.account}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="pwd" className="text-sm font-medium">{t("password")}</label>
            {!signup && <Link href="/login" className="text-[13px] text-cobalt hover:underline">{t("forgot")}</Link>}
          </div>
          <div className="relative">
            <input
              id="pwd"
              type={show ? "text" : "password"}
              autoComplete={signup ? "new-password" : "current-password"}
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              aria-invalid={!!errors.pwd}
              aria-describedby={errors.pwd ? "pwd-err" : undefined}
              className={`field pr-11 ${errors.pwd ? "border-promo" : ""}`}
            />
            <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-faint hover:text-ink">
              {show ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          </div>
          {errors.pwd && <p id="pwd-err" className="mt-1.5 text-[13px] text-[#d8430f]">{errors.pwd}</p>}
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary w-full h-12 disabled:opacity-70">
          {signup ? tc("signup") : t("submit")}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6 text-[13px] text-faint">
        <span className="flex-1 h-px bg-line" />
        {t("or")}
        <span className="flex-1 h-px bg-line" />
      </div>
      <Link href="/console" className="btn btn-ghost w-full h-11">
        <Building2 size={16} aria-hidden="true" />
        {t("sso")}
      </Link>
      <p className="mt-8 text-sm text-muted text-center">
        {signup ? (
          <>
            {t("hasAccount")}{" "}
            <Link href="/login" className="text-cobalt font-semibold hover:underline">{tc("login")}</Link>
          </>
        ) : (
          <>
            {t("noAccount")}{" "}
            <Link href="/login?mode=signup" className="text-cobalt font-semibold hover:underline">{t("register")}</Link>
          </>
        )}
      </p>
    </div>
  );
}
