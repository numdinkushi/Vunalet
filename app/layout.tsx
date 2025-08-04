import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Russo_One, Bungee, Righteous, Chakra_Petch } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-russo-one",
  weight: "400",
  subsets: ["latin"],
});

const bungee = Bungee({
  variable: "--font-bungee",
  weight: "400",
  subsets: ["latin"],
});

const righteous = Righteous({
  variable: "--font-righteous",
  weight: "400",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vunalet - Harvesting the Future",
  description: "Connect directly with local farmers and access the freshest produce while supporting sustainable agriculture in South Africa",
  keywords: ["agriculture", "farm-to-table", "sustainable farming", "fresh produce", "South Africa"],
  authors: [{ name: "Vunalet Team" }],
  openGraph: {
    title: "Vunalet - Harvesting the Future",
    description: "Connect directly with local farmers and access the freshest produce",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/"}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#147A4E',
          colorBackground: '#ffffff',
          colorText: '#1a1a1a',
        },
      }}
    >
    <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} ${bungee.variable} ${righteous.variable} ${chakraPetch.variable} antialiased`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
