"use client";

import dynamic from "next/dynamic";

const SiteApp = dynamic(() => import("@/site/App"), { ssr: false });

export default function HomePage() {
  return <SiteApp />;
}
