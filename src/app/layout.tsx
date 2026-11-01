import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  title: "University AI Student Counseling & SWOT Matrix (Demo)",
  description: "Advanced SWOT analysis and proactive student support system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50 text-slate-800">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
