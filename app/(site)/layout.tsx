import type { Metadata } from "next";
import "../../styles/liquid.css";

export const metadata: Metadata = {
  title: "Tabiat Gran Agriculture Company",
  description: "Agriculture development, food security and rural livelihood programs across Afghanistan.",
};

export default function SiteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
