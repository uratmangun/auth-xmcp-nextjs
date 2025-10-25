import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ParaProvider } from "@/components/providers/para-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth XMCP - Better Auth + OIDC + Para Wallet",
  description: "Secure MCP endpoints with Better Auth OIDC Provider. OAuth-protected Model Context Protocol server with Next.js 15, Drizzle ORM, and Para wallet integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ParaProvider>
          {children}
        </ParaProvider>
      </body>
    </html>
  );
}
