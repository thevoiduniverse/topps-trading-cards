import type { Metadata } from "next";
import { Rajdhani, Bebas_Neue } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "TOPPS Trading Cards | Ultimate Football Collection",
  description: "Buy, collect, and rip packs of premium football trading cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rajdhani.variable} ${bebasNeue.variable} antialiased`}
        style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
      >
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
