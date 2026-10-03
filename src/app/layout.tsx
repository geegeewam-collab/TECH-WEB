import type { Metadata } from "next";
import { Archivo_Narrow, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const display = Archivo_Narrow({ weight: "700", subsets: ["latin"], variable: "--font-display" });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GEEGEE TECH | Software that gets African businesses paid",
  description: "Payment integrations, booking platforms and custom systems for African businesses. Built in Nairobi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
