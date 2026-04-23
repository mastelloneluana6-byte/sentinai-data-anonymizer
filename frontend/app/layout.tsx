import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "SentinAI Hybrid Security Engine",
  description: "Premium hybrid security: Python orchestration + C++ performance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable}`}>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
