import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "../components/navbar";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Idea Manager",
  description: "Create and Manage your Ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <main className="">{children}</main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
