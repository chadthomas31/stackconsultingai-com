import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SampleSiteView from "@/components/samples/SampleSiteView";
import { SAMPLE_SITES, getSample } from "@/lib/samples";

export const dynamic = "force-static";

interface Params {
  params: Promise<{ vertical: string }>;
}

export function generateStaticParams() {
  return SAMPLE_SITES.map((s) => ({ vertical: s.vertical }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { vertical } = await params;
  const site = getSample(vertical);
  if (!site) return { title: "Sample not found" };
  return {
    title: `${site.business} (sample ${site.industry.toLowerCase()} website) | Stack Consulting AI`,
    description: `A sample ${site.industry.toLowerCase()} website by Stack Consulting AI, with a live AI receptionist demo.`,
    // Fictional business: keep it out of search results.
    robots: { index: false, follow: true },
  };
}

export default async function SamplePage({ params }: Params) {
  const { vertical } = await params;
  const site = getSample(vertical);
  if (!site) notFound();
  return <SampleSiteView site={site} />;
}
