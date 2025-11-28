import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";
import Navbar from "@/components/Navbar";

import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

export const metadata = {
  metadataBase: new URL("https://etherml.vercel.app"),
  title: "EtherML - Train and Compare Machine Learning Models",
  description:
    "EtherML is a powerful ML dashboard to upload datasets, auto-train models and compare their performance live.",

  openGraph: {
    title: "EtherML - ML Model Comparison Platform",
    description:
      "Upload datasets, auto-train multiple machine learning models and discover the best one – in your browser.",
    url: "https://etherml.vercel.app",
    siteName: "EtherML",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EtherML AI Dashboard",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EtherML - ML Model Comparison Platform",
    description: "Auto-train and compare machine learning models with EtherML.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          min-h-screen
          bg-linear-to-br from-background via-border to-background
          text-foreground
          overflow-x-hidden
        `}
      >
        <ThemeProvider>
          {/* APP WRAPPER */}
          <div className="min-h-screen flex flex-col">
            {/* NAVBAR */}
            <Navbar />

            {/* MAIN CONTENT */}
            <main
              className="
                flex-1
                w-full
                max-w-6xl
                mx-auto
                px-2 sm:px-4 md:px-6
                py-4
                overflow-hidden
              "
            >
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
