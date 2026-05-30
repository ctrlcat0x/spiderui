"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { HeroButtons } from "@/components/landing/hero-buttons"
import { Footer } from "@/components/footer"
import { Signature } from "@workspace/ui/components/signature"
import { ScrubInputDemo } from "@/components/docs/previews/scrub-input-preview"
import { ImageTrailDemo } from "@/components/docs/previews/image-trail-preview"
import { CollectionSurferPreview } from "@/components/docs/previews/collection-surfer-preview"

const showcaseCardClass =
  "relative flex flex-col rounded-2xl border border-border bg-white dark:bg-[#1a1a1a] p-2 shadow-card transition-all duration-300 hover:border-input hover:shadow-card-hover"

const showcasePreviewClass =
  "relative flex-1 w-full overflow-hidden rounded-xl border border-dashed border-border bg-zinc-50 dark:bg-[#111] shadow-surface-inset transition-colors"

export default function Home() {
  return (
    <div
      data-route-home
      className="relative min-h-screen w-full bg-white dark:bg-[#111] text-foreground transition-colors duration-300 selection:bg-zinc-200 dark:selection:bg-zinc-800"
    >
      <SiteHeader />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-start pt-40 pb-32 px-4 sm:px-6 overflow-x-clip">
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="group inline-flex cursor-pointer items-center rounded-full border border-border bg-white/40 dark:bg-zinc-900/30 px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 backdrop-blur-xl shadow-panel transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
            <span className="flex size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] mr-2.5 animate-pulse" />
            5 curated components
            <svg className="ml-2 size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        <div className="max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-900 dark:text-white text-5xl sm:text-6xl md:text-7xl leading-[1.0] font-semibold font-display tracking-[-0.06em]"
          >
            Animated components
            <br className="hidden sm:block" />
            that actually ship.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-base sm:text-lg md:text-xl text-zinc-400 dark:text-zinc-600 max-w-2xl mx-auto font-medium tracking-tight"
          >
            Spider UI — copy-paste React components built with Tailwind, TypeScript, and Framer Motion.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 w-full"
        >
          <HeroButtons />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 auto-rows-[300px] mb-20 px-4"
        >
          <Link href="/docs/components/collection-surfer" className={`md:col-span-2 md:row-span-2 ${showcaseCardClass}`}>
            <div className={`${showcasePreviewClass} min-h-[320px]`}>
              <CollectionSurferPreview src="/demo/collection-surfer/simple" title="Collection Surfer preview" />
            </div>
            <div className="shrink-0 pt-3 pb-1 px-3 text-sm font-medium text-zinc-700 dark:text-zinc-400">
              Collection surfer
            </div>
          </Link>

          <Link href="/docs/components/signature" className={`md:col-span-1 md:row-span-1 ${showcaseCardClass}`}>
            <div className={`${showcasePreviewClass} flex items-center justify-center p-6`}>
              <Signature text="Spider UI" fontSize={28} />
            </div>
            <div className="shrink-0 pt-3 pb-1 px-3 text-sm font-medium text-zinc-700 dark:text-zinc-400">
              Signature
            </div>
          </Link>

          <Link href="/docs/components/scrub-input" className={`md:col-span-1 md:row-span-1 ${showcaseCardClass}`}>
            <div className={showcasePreviewClass}>
              <ScrubInputDemo />
            </div>
            <div className="shrink-0 pt-3 pb-1 px-3 text-sm font-medium text-zinc-700 dark:text-zinc-400">
              Scrub input
            </div>
          </Link>

          <Link href="/docs/components/image-trail" className={`md:col-span-2 md:row-span-1 ${showcaseCardClass}`}>
            <div className={`${showcasePreviewClass} min-h-[280px]`}>
              <ImageTrailDemo />
            </div>
            <div className="shrink-0 pt-3 pb-1 px-3 text-sm font-medium text-zinc-700 dark:text-zinc-400">
              Image trail
            </div>
          </Link>

          <Link href="/docs/components/scroll-split-card" className={`md:col-span-2 md:row-span-1 ${showcaseCardClass}`}>
            <div className={`${showcasePreviewClass} flex items-center justify-center p-8 bg-zinc-100 dark:bg-zinc-900`}>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs">
                Scroll-driven card that splits into three panels and flips on scroll.
              </p>
            </div>
            <div className="shrink-0 pt-3 pb-1 px-3 text-sm font-medium text-zinc-700 dark:text-zinc-400">
              Scroll split card
            </div>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
