import type React from "react"
import type { Metadata } from "next"
import { openGraphImages } from "@/lib/site"

export const metadata: Metadata = {
  title: "Components Documentation",
  description: "Browse the complete collection of Spider UI components. Free, open-source React components with copy-paste code, Tailwind CSS styling, and Framer Motion animations by ctrlcat0X.",
  openGraph: {
    title: "UI Components Documentation | Spider UI by ctrlcat0X",
    description: "Browse all React UI components. Copy-paste ready code with Tailwind CSS and Framer Motion.",
    images: [...openGraphImages],
  },
  alternates: {
    canonical: "https://spiderui.dev/docs",
  },
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div data-route-docs className="min-h-svh flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        {/* Main content - Full screen split view handled by pages */}
        <main className="flex-1 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  )
}
