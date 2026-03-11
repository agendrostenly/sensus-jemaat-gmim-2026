import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Formulir Sensus Jemaat GMIM 2026",
  description: "Formulir Sensus Warga Gereja Masehi Injili di Minahasa Tahun 2026. Sistem pendataan jemaat digital.",
  keywords: ["GMIM", "Sensus Jemaat", "Gereja", "Minahasa", "2026", "Form Digital"],
  authors: [{ name: "GMIM" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Formulir Sensus Jemaat GMIM 2026",
    description: "Formulir Sensus Warga Gereja Masehi Injili di Minahasa Tahun 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
