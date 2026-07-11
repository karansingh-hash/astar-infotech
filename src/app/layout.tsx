import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A-Star Infotech | Web Development & Digital Solutions Agency in Jaipur",
  description:
    "A-Star Infotech is a Jaipur-based web development agency offering professional website design, e-commerce development, responsive websites, SEO services, and website maintenance for businesses across India. Get a free consultation today!",
  keywords: [
    "web development Jaipur",
    "website design Jaipur",
    "website development Rajasthan",
    "e-commerce development India",
    "SEO services Jaipur",
    "responsive website design",
    "A-Star Infotech",
    "digital agency Jaipur",
    "website maintenance",
    "web developer near me",
    "best web development company Jaipur",
    "small business website",
  ],
  authors: [{ name: "A-Star Infotech" }],
  creator: "A-Star Infotech",
  publisher: "A-Star Infotech",
  metadataBase: new URL("https://www.astarinfotech.in"),
  alternates: {
    canonical: "https://www.astarinfotech.in/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "A-Star Infotech | Web Development & Digital Solutions Agency",
    description:
      "Professional website design, e-commerce development, SEO services, and digital solutions for growing businesses in Jaipur & across India.",
    type: "website",
    url: "https://www.astarinfotech.in/",
    siteName: "A-Star Infotech",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "A-Star Infotech - Web Development Agency in Jaipur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A-Star Infotech | Web Development & Digital Solutions Agency",
    description:
      "Professional website design, e-commerce development, SEO services in Jaipur, India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  other: {
    // Geo / location SEO tags (critical for local SEO)
    "geo.region": "IN-RJ",
    "geo.placename": "Jaipur, Rajasthan, India",
    "geo.position": "26.9124;75.7873",
    ICBM: "26.9124, 75.7873",
    // Mobile / PWA
    "theme-color": "#059669",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=yes, email=yes, address=yes",
    // Crawler hints
    language: "en-IN",
    "revisit-after": "7 days",
    rating: "general",
    distribution: "global",
    // Dublin Core metadata (improves semantic discovery)
    "DC.title": "A-Star Infotech | Web Development Agency in Jaipur",
    "DC.creator": "A-Star Infotech",
    "DC.subject": "Web Development, Website Design, E-Commerce, SEO Services in Jaipur India",
    "DC.description": "Professional web development agency in Jaipur offering website design, e-commerce development, SEO services, and website maintenance across India.",
    "DC.language": "en-IN",
    "DC.coverage": "Jaipur, Rajasthan, India",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
