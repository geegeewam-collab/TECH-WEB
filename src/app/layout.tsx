import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GEEGEE TECH | Software that gets African businesses paid",
  description: "Payment integrations, booking platforms and custom systems for African businesses. Built in Nairobi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
