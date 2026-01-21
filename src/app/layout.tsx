import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const saans = localFont({
  src: [
    {
      path: "../../public/fonts/Saans-TRIAL-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Saans-TRIAL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Saans-TRIAL-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Saans-TRIAL-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Saans-TRIAL-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Saans-TRIAL-Heavy.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-saans",
});

export const metadata: Metadata = {
  title: "neXGen Collectibles | Premium Football Trading Cards",
  description: "Collect, trade, and open packs of premium football trading cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${saans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
