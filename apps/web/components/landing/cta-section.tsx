"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Github } from "lucide-react"
import { CopyButton } from "@/components/copy-button"

const installCommand = "npx shadcn@latest add @spiderui/name"

export function CtaSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border bg-zinc-900 px-6 py-12 text-center dark:bg-[#1a1a1a] sm:px-10 sm:py-14"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.04),transparent_50%)]" />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Get started
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Your next component is one command away
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
            Open the docs, pick a component, and paste it into your app. Free,
            open source, and built to ship.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-900 transition-opacity hover:opacity-90 sm:w-auto"
            >
              Open documentation
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="https://github.com/ctrlcat0x/spiderui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-800 sm:w-auto"
            >
              <Github className="size-4" />
              View on GitHub
            </Link>
          </div>

          <div className="mx-auto mt-6 inline-flex h-10 max-w-full items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-950/50 px-3">
            <span className="truncate font-mono text-xs text-zinc-400">
              {installCommand}
            </span>
            <CopyButton code={installCommand} absolute={false} className="p-1" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
