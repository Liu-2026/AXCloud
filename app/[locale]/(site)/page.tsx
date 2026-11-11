import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import Offers from "@/components/home/Offers";
import AISection from "@/components/home/AISection";
import Catalog from "@/components/home/Catalog";
import Solutions from "@/components/home/Solutions";
import Infra from "@/components/home/Infra";
import Service from "@/components/home/Service";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Offers />
      <AISection />
      <Catalog />
      <Suspense>
        <Solutions />
      </Suspense>
      <Infra />
      <Service />
    </>
  );
}
