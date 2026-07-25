import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="relative flex flex-col items-center justify-center bg-background font-sans">
        <Navbar />
        {children}
        <Footer />
      </div>
    </main>
  );
}