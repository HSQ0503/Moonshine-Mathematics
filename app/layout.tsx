import type { Metadata } from "next";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Moonshine Mathematics",
  description: "A journal of nocturnal study — scientia per noctem, scientia per lunam.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <div className="app-root">{children}</div>
      </body>
    </html>
  );
}
