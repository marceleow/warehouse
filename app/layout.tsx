import { Toaster } from "#/components/ui/sonner";
import { cn } from "#/lib/utils";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Dock from "#/components/Dock";

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warehouse",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, interSans.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Dock />
        <Toaster />
      </body>
    </html>
  );
}
