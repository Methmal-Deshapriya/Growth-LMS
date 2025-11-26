import React from "react";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="min-h-screen flex flex-col items-center bg-secbackground font-sans dark:bg-secbackground">
        <div className="relative flex flex-col items-center justify-center bg-white">
          {/* <ThemeToggle /> */}
          <Navbar />
          {children}
          <Footer />
        </div>
      </div>
    </main>
  );
}
