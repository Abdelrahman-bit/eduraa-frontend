import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-learning Platform",
  description: "E-learning platform for students and teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <Header />

        <main className="flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
