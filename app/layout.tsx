import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Using system fonts instead of Google Fonts to avoid network dependency during build

export const metadata: Metadata = {
  title: "Acceding Titans - Community Hub for Entrepreneurs | Business Networking Platform",
  description: "Connect, showcase, and grow with Acceding Titans - the ultimate community platform for entrepreneurs. Build your business catalogue, network with like-minded professionals, advertise your services, and unlock unlimited opportunities.",
  keywords: "entrepreneur community, business networking, business catalogue, professional network, startup community, entrepreneurship, small business, networking platform, business opportunities, job listings, entrepreneur platform, business growth, professional community, direct messaging, business advertising, referral program",
  authors: [{ name: "Acceding Titans" }],
  creator: "Acceding Titans",
  publisher: "Acceding Titans",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  metadataBase: new URL("https://ascendingtitans.com"),
  alternates: {
    canonical: "https://ascendingtitans.com",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon.png?v=2",
        sizes: "any",
        type: "image/png",
      },
      {
        url: "/icon.png?v=2",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon.png?v=2",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    apple: {
      url: "/icon.png?v=2",
      sizes: "180x180",
      type: "image/png",
    },
    shortcut: "/icon.png?v=2",
  },
  openGraph: {
    type: "website",
    url: "https://ascendingtitans.com",
    title: "Acceding Titans - Connect, Showcase, and Grow Together",
    description: "Join 10,000+ entrepreneurs on Africa's premier business networking platform. Showcase your products, find collaborators, advertise your services, and grow your business.",
    siteName: "Acceding Titans",
    images: [
      {
        url: "https://ascendingtitans.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Acceding Titans - Community Platform for Entrepreneurs",
      },
      {
        url: "https://ascendingtitans.com/banner.png",
        width: 800,
        height: 420,
        alt: "Acceding Titans - Your business community hub",
        type: "image/png",
      },
    ],
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acceding Titans - Connect with 10,000+ Entrepreneurs",
    description: "Showcase your business, network with professionals, and unlock opportunities on Africa's leading entrepreneur community platform.",
    images: ["https://ascendingtitans.com/banner.png"],
    creator: "@AscendingTitans",
    site: "@AscendingTitans",
  },
  category: "Business & Entrepreneurship",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Acceding Titans",
    url: "https://ascendingtitans.com",
    logo: "https://ascendingtitans.com/icon.png",
    description: "Acceding Titans is Africa's premier community platform where entrepreneurs, business owners, and professionals connect, showcase their businesses, collaborate, and unlock unlimited growth opportunities.",
    sameAs: [
      "https://www.facebook.com/AscendingTitans",
      "https://www.twitter.com/AscendingTitans",
      "https://www.instagram.com/AscendingTitans",
      "https://www.linkedin.com/company/ascending-titans",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@ascendingtitans.com",
      telephone: "+234 (0) 700 000 0000",
      availableLanguage: ["en"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lagos",
      addressCountry: "NG",
      addressRegion: "Lagos State",
    },
    foundingDate: "2024",
    areaServed: "NG",
    knowsAbout: [
      "Entrepreneurship",
      "Business Networking",
      "Community Building",
      "Business Growth",
      "Professional Networking",
      "Business Catalogues",
      "Job Opportunities",
      "Startup Community",
      "Small Business",
      "Business Opportunities",
    ],
    offers: [
      {
        "@type": "Service",
        name: "Business Catalogue",
        description: "Showcase your products and services to thousands of engaged entrepreneurs and grow your sales.",
      },
      {
        "@type": "Service",
        name: "Community Networking",
        description: "Connect, collaborate, and grow your network with fellow entrepreneurs and business owners.",
      },
      {
        "@type": "Service",
        name: "Direct Messaging",
        description: "Communicate directly with community members via WhatsApp and in-app messaging.",
      },
      {
        "@type": "Service",
        name: "Advertising Platform",
        description: "Promote your business with text, images, and short video content to reach thousands.",
      },
      {
        "@type": "Service",
        name: "Job Opportunities",
        description: "Find and post gigs and job opportunities within the entrepreneur community.",
      },
      {
        "@type": "Service",
        name: "Birthday Rewards Program",
        description: "Celebrate members with personalized rewards and recognition from the community.",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Acceding Titans",
    url: "https://ascendingtitans.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://ascendingtitans.com/search?q={search_term_string}",
      },
      query: "required name=search_term_string",
    },
    description: "Community platform for entrepreneurs to connect, showcase businesses, network, and unlock growth opportunities.",
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Acceding Titans",
    image: "https://ascendingtitans.com/banner.png",
    description: "Africa's premier community platform connecting entrepreneurs, business owners, and professionals for networking, business growth, and collaboration.",
    url: "https://ascendingtitans.com",
    telephone: "+234 (0) 700 000 0000",
    priceRange: "₦₦",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lagos, Nigeria",
      addressCountry: "NG",
      addressRegion: "Lagos State",
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    sameAs: [
      "https://www.facebook.com/AscendingTitans",
      "https://www.twitter.com/AscendingTitans",
      "https://www.instagram.com/AscendingTitans",
    ],
    serviceType: ["Community Platform", "Business Networking", "Professional Services"],
  };

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
          strategy="afterInteractive"
        />

        {/* Additional Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="theme-color" content="#C9A84C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Acceding Titans" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#C9A84C" />
        <meta name="msapplication-TileImage" content="/icon.png" />

        {/* Preconnect to External Sources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://analytics.google.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Google Analytics 4 with Enhanced Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L0LS146KZG"
          strategy="afterInteractive"
          async
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-L0LS146KZG', {
                'page_path': window.location.pathname,
                'page_title': document.title,
                'anonymize_ip': false,
                'allow_google_signals': true,
                'allow_ad_personalization_signals': true,
                'send_page_view': true,
                'cookie_flags': 'SameSite=None;Secure'
              });
              
              // Track all navigation events
              window.addEventListener('popstate', function() {
                gtag('event', 'page_view', {
                  'page_path': window.location.pathname,
                  'page_title': document.title,
                  'page_referrer': document.referrer
                });
              });
              
              // Enable enhanced measurement
              gtag('event', 'page_view', {
                'send_to': 'G-L0LS146KZG',
                'page_title': document.title,
                'page_path': window.location.pathname
              });
            `,
          }}
        />

        {/* Google Ads Conversion Tracking (placeholder - update with your conversion ID) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-YOUR_CONVERSION_ID"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
