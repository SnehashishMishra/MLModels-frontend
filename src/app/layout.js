import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";
import Navbar from "@/components/Navbar";

import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

export const metadata = {
  title: "ML Dashboard",
  description: "ML Model Comparison Dashboard with FastAPI backend",
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
        className={`$
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
