import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Mwenaro Talent Platform",
    description: "Connecting top tech talent with opportunities",
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
