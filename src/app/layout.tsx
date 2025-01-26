import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Jira",
  description: "by Nabil",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Open Graph Meta Tags (for social media sharing) */}
        <meta property="og:title" content="Your App Title" />
        <meta property="og:description" content="Your app description goes here." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://yourapp.com" />
      </head>
      <body className={`${outfitSans.className} bg-my-bg text-my-paragraph antialiased h-screen`}>
        {children}
      </body>
    </html>
  );
}
