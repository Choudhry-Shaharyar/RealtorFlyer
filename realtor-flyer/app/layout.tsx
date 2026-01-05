import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.realtorflyer.ca'),
  title: {
    default: "AI Real Estate Flyer Generator | Create Stunning Flyers in Seconds",
    template: "%s | RealtorFlyer",
  },
  description: "The #1 AI flyer generator for realtors. Create professional real estate listing flyers, just listed posts, and open house materials instantly. No design skills needed.",
  keywords: [
    "AI real estate flyer generator",
    "AI flyer generator for realtors",
    "real estate flyer maker",
    "create real estate flyer online",
    "property listing flyer generator",
    "automated real estate marketing flyer",
    "AI property flyer",
    "Canadian real estate marketing",
    "MLS flyer creator"
  ],
  authors: [{ name: "RealtorFlyer" }],
  creator: "RealtorFlyer",
  openGraph: {
    title: "AI Real Estate Flyer Generator - RealtorFlyer",
    description: "Generate professional real estate flyers instantly with AI. The fastest way to create listing marketing materials.",
    locale: "en_CA",
    type: "website",
    siteName: "RealtorFlyer",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Real Estate Flyer Generator - RealtorFlyer",
    description: "Generate professional real estate flyers instantly with AI.",
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
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
