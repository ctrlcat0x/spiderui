"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import localFont from "next/font/local";

import { Footer } from "@/components/footer";
import { HeroButtons } from "@/components/landing/hero-buttons";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { SiteHeader } from "@/components/site-header";
import { MotionAccordion } from "@workspace/ui/components/motion-accordion";
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur";

const nighty = localFont({
  src: "./fonts/nighty.woff2",
  display: "swap",
});

const faqs = [
  {
    question: "What is Spider UI?",
    answer:
      "Spider UI is a collection of polished, copy-and-paste React components built for real products.",
  },
  {
    question: "Do I need to install a package?",
    answer:
      "No. Add only the components you need through the shadcn CLI and own the source in your project.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes. Every component is yours to edit, restyle, and adapt to your design system.",
  },
  {
    question: "Does it work with existing shadcn/ui projects?",
    answer:
      "Yes. Spider UI follows the same registry workflow and fits into existing shadcn/ui projects.",
  },
  {
    question: "What powers the animations?",
    answer:
      "The interactions use Motion and focused browser APIs, with reduced-motion behavior included.",
  },
];

export default function Home() {
  return (
    <div
      data-route-home
      className="relative min-h-screen w-full bg-white text-foreground selection:bg-orange-200 [--landing-background:#fff] dark:bg-[#111] dark:selection:bg-orange-950 dark:[--landing-background:#111]"
    >
      <ProgressiveBlur
        position="top"
        height="7rem"
        backgroundColor="var(--landing-background)"
        className="fixed z-40"
      />
      <SiteHeader transparent />

      <main className="relative z-10 overflow-x-clip">
        <section className="flex min-h-[760px] items-center justify-center px-5 pb-24 pt-32 sm:min-h-[820px] sm:px-6 sm:pb-28 sm:pt-36">
          <div className="w-full max-w-7xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`${nighty.className} mx-auto max-w-xl text-balance text-[clamp(3.5rem,7vw,6rem)] font-normal leading-[0.9] tracking-[-0.02em] text-zinc-900 dark:text-zinc-50`}
            >
              Give your UI some character
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto mt-6 max-w-xl text-balance text-sm leading-6 text-zinc-500 sm:mt-7 sm:text-base"
            >
              Thoughtful components for React and shadcn, built with expressive{" "}
              <span className="text-orange-500">motion</span> and careful{" "}
              <span className="text-orange-500">design</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-5"
            >
              <HeroButtons />
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-xl px-6 py-24 sm:py-32">
          <div className="mb-8 flex items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/founder-note.png"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                A note from ctrlcat0X.
              </p>
            </div>
            <time className="shrink-0 text-zinc-400" dateTime="2026-08-20">
              2026-08-20
            </time>
          </div>

          <div className="space-y-5 text-pretty text-base leading-7 text-zinc-500 dark:text-zinc-400">
            <p>
              Spider UI was born to raise the bar for component libraries—not by
              padding a catalog with 200 ugly components, but by making fewer
              pieces with stronger design and purposeful motion.
            </p>
            <p>Take what you need. Make it yours.</p>
          </div>
        </section>

        <div className="pb-24 pt-6 sm:pb-32">
          <ShowcaseSection />
        </div>

        <section className="mx-auto max-w-2xl px-6 pb-32 pt-10 sm:pb-40">
          <div className="mb-10 text-center">
            <h2
              className={`${nighty.className} text-4xl font-normal leading-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl`}
            >
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Anything else?{" "}
              <a
                className="text-orange-500 hover:text-orange-400"
                href="mailto:developer.sahilran@gmail.com"
              >
                Drop me an email.
              </a>
            </p>
          </div>

          <MotionAccordion items={faqs} gap={10} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
