import type React from "react"
import type { Metadata, Viewport } from "next"
import { Albert_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { JsonLd } from "@/components/seo/json-ld"
import { RouteScrollbarController } from "@/components/route-scrollbar-controller"

const fontSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
})

const fontDisplay = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const siteUrl = "https://spiderui.dev"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spider UI - Premium React UI Component Library by ctrlcat0X",
    template: "%s | Spider UI - UI Component Library",
  },
  description: "Spider UI is a free, open-source React UI component library by ctrlcat0X. Beautiful, animated, copy-paste components built with Tailwind CSS, TypeScript, and Framer Motion. The best UI components for modern web applications.",
  keywords: [
    "Spider UI",
    "Spider UI",
    "spiderui.dev",
    "UI component library",
    "React components",
    "React UI library",
    "UI components",
    "component library",
    "Tailwind CSS components",
    "TypeScript components",
    "Framer Motion",
    "Next.js components",
    "animated components",
    "copy paste components",
    "free UI components",
    "open source components",
    "modern UI",
    "web components",
    "frontend components",
    "design system",
    "ctrlcat0X",
    "ctrlcat0X developer",
    "ctrlcat0X portfolio",
    "ctrlcat0x",
    "React developer",
    "frontend developer",
    "shadcn alternative",
    "radix ui",
    "beautiful UI",
    "premium components",
    "handcrafted components",
  ],
  authors: [
    { name: "ctrlcat0X", url: "https://twitter.com/ctrlcat0x" },
    { name: "ctrlcat0X", url: "https://github.com/ctrlcat0x" },
  ],
  creator: "ctrlcat0X",
  publisher: "ctrlcat0X",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Spider UI - Premium React UI Component Library by ctrlcat0X",
    description: "Free, open-source React UI components. Beautiful, animated, copy-paste components built with Tailwind CSS, TypeScript & Framer Motion by ctrlcat0X.",
    siteName: "Spider UI",
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "Spider UI - Premium React UI Component Library",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spider UI - Premium React UI Component Library",
    description: "Free, open-source React UI components by ctrlcat0X. Beautiful, animated, copy-paste components.",
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "Spider UI - Premium React UI Component Library",
      },
    ],
    creator: "@ctrlcat0x",
    site: "@ctrlcat0x",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "UI Component Library",
  other: {
    "msapplication-TileImage": "/og.png",
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <Analytics />
      <head>
        <JsonLd />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} ${fontDisplay.variable} relative font-sans antialiased`}
        style={{ "--font-heading": "var(--font-display)" } as React.CSSProperties}
      >
        <div className="isolate relative flex min-h-svh flex-col">
          <RouteScrollbarController />
          <Providers>{children}</Providers>
        </div>
        <SpeedInsights />
      </body>
    </html>
  )
}
