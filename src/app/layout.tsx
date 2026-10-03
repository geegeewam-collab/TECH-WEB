import type { Metadata } from "next";
import { Archivo_Narrow, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";

const display = Archivo_Narrow({ weight: "700", subsets: ["latin"], variable: "--font-display" });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GEEGEE TECH | Digital Systems Nairobi",
  description: "High-performance payment and booking infrastructure for African businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
