import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Airbnb | Holiday Rentals, Cabins, Beach Houses & More",
  description:
    "Find holiday rentals, cabins, beach houses, unique homes and experiences around the world - all made possible by hosts on Airbnb.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
