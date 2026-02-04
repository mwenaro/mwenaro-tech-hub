import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Mwenaro Labs | Innovation & Digital Solutions",
    description: "Futuristic digital solutions and R&D by Mwenaro Tech Hub",
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
