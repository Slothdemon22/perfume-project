import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Classic Perfumes | Signature Luxury Fragrances",
    template: "%s | Classic Perfumes House",
  },
  description:
    "Explore Classic Perfumes' signature collection of luxury fragrances. From deep woody notes to fresh citrus blends, discover scents crafted for timeless elegance and memorable impressions.",
  applicationName: "Classic Perfumes",
  keywords: [
    "Classic Perfumes",
    "Luxury Perfume Pakistan",
    "Signature Fragrances",
    "Niche Perfumes",
    "Woody Scent House",
    "Floral Perfume Collection",
    "Oriental Oud Fragrances",
    "Premium Perfume Online Shop",
  ],
  authors: [{ name: "Classic Perfumes Team" }],
  creator: "Classic Perfumes",
  publisher: "Classic Perfumes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Classic Perfumes",
    title: "Classic Perfumes | Luxury Signature Fragrances",
    description:
      "Crafting timeless fragrance experiences with premium ingredients and elegant refinement.",
    images: [
      {
        url: "/images/hero_banner_1773220198541.png",
        width: 1200,
        height: 630,
        alt: "Classic Perfumes Luxury Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Classic Perfumes | Luxury Signature Fragrances",
    description:
      "Crafting timeless fragrance experiences with premium ingredients and elegant refinement.",
    images: ["/images/hero_banner_1773220198541.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

import AiAssistant from "@/components/AiAssistant";
import CartSidebar from "@/components/CartSidebar";
import AppToaster from "@/components/AppToaster";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Classic Perfumes",
    "url": siteUrl,
    "logo": `${siteUrl}/icon.png`,
    "description": "Premium luxury fragrance house specializing in signature blends.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+92-327-4402705",
        "contactType": "customer service",
        "areaServed": "PK",
        "availableLanguage": "English"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          <div className="site-content">{children}</div>
          <AppToaster />
          <CartSidebar />
          <AiAssistant />
        </CartProvider>
      </body>
    </html>
  );
}
