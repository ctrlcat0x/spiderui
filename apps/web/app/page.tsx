"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { HeroButtons } from "@/components/landing/hero-buttons"
import { StatsBar } from "@/components/landing/stats-bar"
import { ShowcaseSection } from "@/components/landing/showcase-section"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div
      data-route-home
      className="relative min-h-screen w-full bg-white dark:bg-[#111] text-foreground transition-colors duration-300 selection:bg-zinc-200 dark:selection:bg-zinc-800"
    >
      <SiteHeader />

      <main className="relative z-10 overflow-x-clip">
        {/* Hero */}
        <section className="flex flex-col items-center justify-start px-4 pt-40 pb-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Link
              href="/docs"
              className="group inline-flex cursor-pointer items-center rounded-full border border-border bg-white/40 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-panel backdrop-blur-xl transition-colors hover:bg-zinc-100/50 dark:bg-zinc-900/30 dark:text-zinc-300 dark:hover:bg-zinc-800/50 sm:text-sm"
            >
              <span className="mr-2.5 flex size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
              35+ open-source components
              <svg
                className="ml-2 size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <div className="max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl font-semibold leading-[1.0] tracking-[-0.06em] text-zinc-900 dark:text-white sm:text-6xl md:text-7xl"
            >
              Animated components
              <br className="hidden sm:block" />
              that actually ship.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-4 max-w-2xl text-base font-medium tracking-tight text-zinc-500 dark:text-zinc-500 sm:text-lg md:text-xl"
            >
              Handcrafted React components you copy, paste, and ship — built with
              Tailwind, TypeScript, and Motion.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 w-full md:mt-8"
          >
            <HeroButtons />
          </motion.div>

          <StatsBar />
        </section>

        {/* Below the fold */}
        <div className="flex flex-col gap-24 pb-32 pt-8 md:gap-32 md:pb-40">
          <ShowcaseSection />
          <HowItWorksSection />
          <FeaturesSection />
          <CtaSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
