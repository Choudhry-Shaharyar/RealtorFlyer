import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.realtorflyer.ca'),
  title: {
    default: "RealtorFlyer - AI Real Estate Flyer Generator for Canadian Realtors",
    template: "%s | RealtorFlyer",
  },
  description: "Create professional property flyers in seconds using AI. Trusted by Canadian realtors. Free trial - no credit card required. Generate stunning MLS marketing flyers instantly.",
  keywords: [
    "real estate flyer generator",
    "AI flyer maker",
    "property marketing",
    "realtor flyers",
    "Canadian real estate",
    "MLS flyers",
    "open house flyers",
    "listing flyers",
    "real estate marketing",
    "property flyer templates",
  ],
  authors: [{ name: "RealtorFlyer" }],
  creator: "RealtorFlyer",
  openGraph: {
    title: "RealtorFlyer - AI Real Estate Flyer Generator",
    description: "Create professional property flyers in seconds using AI. No design skills needed.",
    locale: "en_CA",
    type: "website",
    siteName: "RealtorFlyer",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealtorFlyer - AI Real Estate Flyer Generator",
    description: "Create professional property flyers in seconds using AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
  icons: {
    icon: '/favicon.png',
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
