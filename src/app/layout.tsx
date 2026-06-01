import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A-Star Infotech | Building Smart Websites for Growing Businesses",
  description:
    "A-Star Infotech offers professional website development, e-commerce solutions, responsive design, and SEO services for small businesses, startups, and enterprises. Build your digital presence with us.",
  keywords: [
    "web development",
    "website design",
    "e-commerce",
    "SEO services",
    "responsive websites",
    "A-Star Infotech",
    "digital agency",
    "website maintenance",
  ],
  authors: [{ name: "A-Star Infotech" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "A-Star Infotech | Building Smart Websites for Growing Businesses",
    description:
      "Professional website development, e-commerce solutions, and digital services for growing businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
