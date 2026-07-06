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
  metadataBase: new URL("https://astarinfotech.in"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "A-Star Infotech | Web Development & Digital Solutions Agency",
    description:
      "Professional website design, e-commerce development, SEO services, and digital solutions for growing businesses in Jaipur & across India.",
    type: "website",
    url: "https://astarinfotech.in",
    siteName: "A-Star Infotech",
    locale: "en_IN",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "A-Star Infotech - Web Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A-Star Infotech | Web Development & Digital Solutions Agency",
    description:
      "Professional website design, e-commerce development, SEO services in Jaipur, India.",
    images: ["/logo.png"],
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
