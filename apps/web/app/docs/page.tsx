"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  compareComponentsInCategory,
  components,
  getComponentDocsHref,
  isNewComponent,
  type ComponentCategory,
  type ComponentMetadata,
} from "@/registry"
import { SiteHeader } from "@/components/site-header"
import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade"

function ComponentCard({
  component,
  index,
}: {
  component: ComponentMetadata
  index: number
}) {
  const hasPreview = Boolean(component.previewImage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.02 * index,
        ease: "easeOut",
      }}
    >
      <Link
        href={getComponentDocsHref(component.slug)}
        className="group relative flex flex-col rounded-2xl border border-border bg-white dark:bg-zinc-900/50 overflow-hidden transition-all duration-300 shadow-card hover:-translate-y-0.5 hover:border-input hover:shadow-card-hover"
      >
        <div className="p-1.5">
          <div className="relative h-[220px] w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/80 group-hover:bg-zinc-100/50 dark:group-hover:bg-zinc-800/80 transition-colors border border-dashed border-border shadow-surface-inset overflow-hidden">
            {hasPreview && component.previewImage && (
              <Image
                src={component.previewImage}
                alt={`${component.title} preview`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={index < 6}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 px-4 pb-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
              {component.title}
            </h3>
            {isNewComponent(component) && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-border shadow-panel">
                New
              </span>
            )}
          </div>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
            {component.description}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

const categoryOrder: ComponentCategory[] = [
  "Primitives",
  "Components",
  "Carousels",
  "Text Effects",
  "Card Interactions",
  "Logo Clouds",
  "Pricing",
  "Visual Effects",
]

export default function DocsPage() {
  const allComponents = Object.values(components)
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const observers = categoryOrder.map((cat) => {
      const id = cat.toLowerCase().replace(/\s+/g, "-")
      const element = document.getElementById(id)
      if (!element) return null

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setActiveSection(cat)
          }
        },
        { rootMargin: "-20% 0px -50% 0px" }
      )
      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  useEffect(() => {
    if (activeSection) {
      const id = `nav-item-${activeSection}`
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }
  }, [activeSection])

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      items: allComponents
        .filter((c) => c.category === cat)
        .sort(compareComponentsInCategory),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="min-h-screen bg-white dark:bg-[#111] text-zinc-900 dark:text-zinc-100 font-sans overflow-x-hidden">
      <ScrollEdgeFade position="top" variant="docs-index" className="fixed z-40" />
      <ScrollEdgeFade position="bottom" variant="docs-index" className="fixed z-40" />

      <SiteHeader />

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100vw-2rem)] sm:max-w-fit pointer-events-none">
        <nav className="flex items-center gap-1 p-1.5 rounded-2xl border border-border bg-white/80 dark:bg-[#121212] backdrop-blur-xl shadow-card pointer-events-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categoryOrder.map((cat) => {
            const isActive = activeSection === cat
            return (
              <a
                key={cat}
                id={`nav-item-${cat}`}
                href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(cat.toLowerCase().replace(/\s+/g, "-"))?.scrollIntoView({ behavior: "smooth" })
                  setActiveSection(cat)
                }}
                className={`relative px-4 py-2 text-[13px] font-medium transition-all duration-300 rounded-lg whitespace-nowrap flex-shrink-0 ${isActive
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-lg bg-secondary shadow-panel"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </a>
            )
          })}
        </nav>
      </div>

      <main className="max-w-[1400px] mx-auto pt-32 pb-32 px-6 sm:px-8 relative z-10">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter bg-gradient-to-br from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white bg-clip-text text-transparent leading-[1.1] mb-2 inline-block">
            Crafted Components.
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            A growing collection of animated primitives for React.
          </p>
        </div>

        <div className="space-y-24">
          {grouped.map(({ category, items }) => {
            return (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-32">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((component, i) => (
                    <ComponentCard
                      key={component.slug}
                      component={component}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}
