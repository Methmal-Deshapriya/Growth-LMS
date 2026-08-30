import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The system only ever prices in Sri Lankan Rupees — no multi-currency
// support exists anywhere, so this doesn't take a currency argument.
const lkrFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

export function formatLKR(amount: number) {
  return lkrFormatter.format(amount);
}
