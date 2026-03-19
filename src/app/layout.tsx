import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider"; // Import the wrapper we just made

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "University AI Counseling Platform",
  description: "Advanced SWOT analysis and student support system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap all page content in the AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}