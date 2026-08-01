import React from "react";
import { ForceLightTheme } from "@/components/ForceLightTheme";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ForceLightTheme>
      <main>{children}</main>
    </ForceLightTheme>
  );
}
