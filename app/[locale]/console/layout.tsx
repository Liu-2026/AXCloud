import { setRequestLocale } from "next-intl/server";
import ConsoleShell from "@/components/console/ConsoleShell";
import { MotionProvider } from "@/components/motion/primitives";

export const metadata = { title: "Console", robots: { index: false } };

export default async function ConsoleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <MotionProvider>
      <ConsoleShell>{children}</ConsoleShell>
    </MotionProvider>
  );
}
