import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/hooks/useAuth";
import { ToastProvider } from "@/lib/hooks/useToast";
import { WishlistProvider } from "@/lib/hooks/useWishlist";
import { SearchProvider } from "@/lib/hooks/useSearch";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { LoginModal } from "@/components/auth/LoginModal";
import { MotionProvider } from "@/components/layout/MotionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Airbnb | Holiday Rentals, Cabins, Beach Houses & More",
  description:
    "Find holiday rentals, cabins, beach houses, unique homes and experiences around the world - all made possible by hosts on Airbnb.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-ink font-sans antialiased">
        <MotionProvider>
          <ToastProvider>
            <AuthProvider>
              <WishlistProvider>
                <SearchProvider>
                  <Navbar />
                  <div className="flex-1 pb-16 sm:pb-0">{children}</div>
                  <Footer />
                  <BottomNav />
                  <LoginModal />
                </SearchProvider>
              </WishlistProvider>
            </AuthProvider>
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
