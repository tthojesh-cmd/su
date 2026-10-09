import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getLang } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "Organic Farming AI Assistant | AI-Powered Organic Farming Guidance",
  description: "Simple, practical organic farming guidance in English and Telugu.",
  openGraph: { title: "Organic Farming AI Assistant", description: "AI-powered organic farming guidance." },
};
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang={getLang()}><body><Navbar /><main>{children}</main><Footer /></body></html>);
}
