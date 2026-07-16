"use client"

import { motion } from "framer-motion"
import { Box, Paintbrush, Rocket } from "lucide-react"
import { SectionHeading } from "@/components/landing/section-heading"

const steps = [
  {
    icon: Box,
    title: "Install what you need",
    description:
      "Add any component with the shadcn CLI. One command pulls the source into your project — no package lock-in.",
  },
  {
    icon: Paintbrush,
    title: "Make it yours",
    description:
      "Components live in your codebase. Tweak Tailwind classes, props, and motion settings until they match your product.",
  },
  {
    icon: Rocket,
    title: "Ship it",
    description:
      "Drop components into pages, marketing sites, or dashboards. TypeScript types and accessible patterns included.",
  },
] as const

export function HowItWorksSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4">
      <SectionHeading
        eyebrow="How it works"
        title="From install to production in minutes"
        description="Spider UI is built for teams who want beautiful UI without wrestling a black-box dependency."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative rounded-2xl border border-border bg-white/70 p-6 dark:bg-[#1a1a1a]/80"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-zinc-50 dark:bg-zinc-900">
                <step.icon className="size-4 text-zinc-600 dark:text-zinc-400" />
              </span>
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                0{index + 1}
              </span>
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
