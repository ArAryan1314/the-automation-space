import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "The Automation Studio is an elite recruitment agency specializing in Executive AI, Distributed Systems, Cloud Infrastructure, and Core Engineering talent search.",
  keywords: [
    "The Automation Studio",
    "Recruitment Agency",
    "Technical Recruitment",
    "Executive Search",
    "AI Engineers",
    "Machine Learning Recruitment",
    "Tech Salary Benchmarks",
    "Candidate Representation",
    "Distributed Systems Headhunting",
  ],
  authors: [{ name: "The Automation Studio Partner Advisory Team" }],
  creator: "The Automation Studio",
  publisher: "The Automation Studio",
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description:
      "Precision engineering recruitment, executive leadership search, and confidential career advisory.",
    url: "/",
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Automation Studio | Executive & Engineering Talent Agency",
    description:
      "Precision tech recruitment, engineering leadership search, and confidential career advisory.",
    creator: "@automationstudio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#040810",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
