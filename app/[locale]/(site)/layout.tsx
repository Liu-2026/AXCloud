import { setRequestLocale } from "next-intl/server";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import AgentWidget from "@/components/agent/AgentWidget";
import { MotionProvider } from "@/components/motion/primitives";

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <MotionProvider>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <AgentWidget />
    </MotionProvider>
  );
}
