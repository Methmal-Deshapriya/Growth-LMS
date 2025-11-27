import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foundry Academy | Learn AI, Full-Stack, UX/UI, Cybersecurity",
  description:
    "Foundry Academy empowers Sri Lankan students to become industry-ready in AI/ML, Full-Stack Engineering, Cybersecurity, Data Science, and UX/UI through practical bootcamps, real-world projects, and expert mentorship.",

  keywords: [
    "Foundry Academy",
    "Foundry LMS",
    "AI courses Sri Lanka",
    "Machine Learning Bootcamp",
    "Full Stack Engineering Course",
    "Cyber Security Bootcamp",
    "UX UI Design Course Sri Lanka",
    "Data Science for Beginners",
    "IT Courses After A/Ls",
    "Learn AI in Sinhala",
    "Tech Education Sri Lanka",
  ],

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  authors: [{ name: "Foundry Academy" }],

  metadataBase: new URL("https://foundrylms.com"), // update if using another domain

  openGraph: {
    title:
      "Foundry Academy | Become Job-Ready in AI, Full-Stack & Cybersecurity",
    description:
      "Join Sri Lanka’s most practical tech bootcamps in AI, Machine Learning, Full-Stack Development, Cybersecurity, Data Science, and UI/UX. Learn through recordings, assignments, projects, and expert mentorship — all in Sinhala.",
    url: "https://foundrylms.com",
    siteName: "Foundry Academy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foundry Academy Bootcamps",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Foundry Academy | Transform Your Tech Career",
    description:
      "Learn AI, Machine Learning, Full-Stack Development, UX/UI, Cybersecurity & more with Foundry Academy. Designed for beginners aiming for top tech roles.",
    images: ["/og-image.png"],
    creator: "@foundrylms",
  },

  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Foundry Academy",
      url: "https://foundrylms.com",
      description:
        "Foundry Academy delivers industry-ready bootcamps in AI/ML, Full-Stack Development, Cybersecurity, Data Science, and UX/UI for Sri Lankan students.",
      sameAs: [
        "https://www.facebook.com/foundrylms",
        "https://www.instagram.com/foundrylms",
        "https://www.linkedin.com/company/foundrylms",
      ],
      logo: "https://foundrylms.com/favicon.png",
      brand: "Foundry Academy",
      address: {
        "@type": "PostalAddress",
        addressCountry: "LK",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
