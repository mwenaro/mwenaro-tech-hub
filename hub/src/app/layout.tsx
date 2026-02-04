import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Mwenaro Tech Hub",
    description: "The main portal for Mwenaro Tech ecosystem",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
