import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@mwenaro/ui";
import { FooterWrapper } from "@/components/footer-wrapper";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://academy.mwenaro.com"), // Update with actual domain
  title: {
    default: "Mwenaro Tech Academy | Master Tech Skills",
    template: "%s | Mwenaro Tech Academy",
  },
  description: "Join Mwenaro Tech Academy to master software engineering, data science, and AI. Expert-led courses, hands-on projects, and career mentorship.",
  keywords: [
    "Tech Academy",
    "Software Engineering",
    "Coding Bootcamp",
    "Web Development",
    "Data Science",
    "Kenya Tech",
    "Mwenaro",
    "Programming Courses",
  ],
  authors: [{ name: "Mwenaro Tech Hub" }],
  creator: "Mwenaro Tech Hub",
  publisher: "Mwenaro Tech Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Mwenaro Tech Academy | Master Tech Skills",
    description: "Empowering the next generation of tech leaders with practical skills and mentorship.",
    url: "https://academy.mwenaro.com",
    siteName: "Mwenaro Tech Academy",
    images: [
      {
        url: "/logo-full.svg", // Using the full logo verify if this renders well or if a png is needed
        width: 800,
        height: 600,
        alt: "Mwenaro Tech Academy Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mwenaro Tech Academy",
    description: "Launch your tech career with Mwenaro Tech Academy.",
    images: ["/logo-full.svg"], // Same here
    creator: "@mwenarotech",
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
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <NavBar currentApp="academy" />
          <main className="flex-1">{children}</main>
          <ChatWidget />
          <FooterWrapper />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
