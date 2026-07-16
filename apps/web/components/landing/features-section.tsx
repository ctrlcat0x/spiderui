"use client"

import { motion } from "framer-motion"
import {
  Code2,
  Layers,
  Moon,
  MousePointerClick,
  Sparkles,
  Unlock,
} from "lucide-react"
import { SectionHeading } from "@/components/landing/section-heading"

const features = [
  {
    icon: MousePointerClick,
    title: "Copy-paste by design",
    description: "You own the source. No runtime package to debug at 2am.",
  },
  {
    icon: Sparkles,
    title: "Motion that feels intentional",
    description: "Springs, staggers, and micro-interactions — not decoration for decoration's sake.",
  },
  {
    icon: Code2,
    title: "TypeScript throughout",
    description: "Typed props and predictable APIs so your editor does the heavy lifting.",
  },
  {
    icon: Layers,
    title: "shadcn-compatible",
    description: "Installs through the same CLI workflow you already use.",
  },
  {
    icon: Moon,
    title: "Dark mode ready",
    description: "Components respect your theme tokens out of the box.",
  },
  {
    icon: Unlock,
    title: "MIT licensed",
    description: "Free for personal and commercial projects. Fork it, ship it.",
  },
] as const

export function FeaturesSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4">
      <SectionHeading
        eyebrow="Why Spider UI"
        title="Built for product teams, not demos"
        description="Every component is something we'd actually put in a client project — polished enough to ship, flexible enough to adapt."
      />

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.55,
              delay: index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-2xl border border-border/80 bg-zinc-50/50 p-5 dark:bg-zinc-900/30"
          >
            <feature.icon className="mb-3 size-4 text-zinc-500 dark:text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {feature.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
