import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar, Footer } from "@mwenaro/ui";
import { ChatWidget } from "@/components/chat-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mwenaro Tech Academy",
  description: "Empowering the next generation of tech leaders.",
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
          <Footer />
        </div>
      </body>
    </html>
  );
}
