import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Real Estate Flyer Generator for Canadian Realtors | RealtorFlyer",
  description: "Create professional property flyers in seconds using AI. Trusted by 500+ Canadian realtors. Free trial - no credit card required. Generate stunning MLS marketing flyers instantly.",
  openGraph: {
    title: "AI Real Estate Flyer Generator for Canadian Realtors",
    description: "Create professional property flyers in seconds using AI. No design skills needed.",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
