"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function CatalogNavigation() {
  const path = usePathname();
  return <nav className="mb-6 flex gap-2 rounded-xl border border-border bg-card p-1.5">
    {[{ label: "Courses", href: "/admin/catalog/courses" }, { label: "Categories", href: "/admin/catalog/categories" }].map((item) => <Link key={item.href} href={item.href} className={cn("rounded-lg px-4 py-2 text-sm font-semibold", path.startsWith(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>{item.label}</Link>)}
  </nav>;
}
