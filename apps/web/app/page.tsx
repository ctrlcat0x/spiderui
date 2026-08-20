"use client";

import { motion } from "framer-motion";
import localFont from "next/font/local";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { HeroButtons } from "@/components/landing/hero-buttons";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { SiteHeader } from "@/components/site-header";
import { SpiderLogo } from "@/components/logos/spider-logo";

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
      className="relative min-h-screen w-full bg-white text-foreground selection:bg-rose-200 dark:bg-[#111] dark:selection:bg-rose-950"
    >
      <SiteHeader />

      <main className="relative z-10 overflow-x-clip">
        <section className="flex min-h-svh items-center justify-center px-5 pb-20 pt-28 sm:px-6 sm:pt-32">
          <div className="w-full max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`${nighty.className} text-[clamp(3.5rem,8vw,7.5rem)] font-normal leading-[0.92] tracking-[-0.025em] text-zinc-900 dark:text-zinc-50`}
            >
              Craft your UI with motion<span className="text-rose-500">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto mt-7 max-w-xl text-balance text-sm leading-6 text-zinc-500 sm:text-base"
            >
              Polished <span className="text-rose-500">primitives</span> and{" "}
              <span className="text-rose-500">components</span> for React and
              shadcn, shaped with thoughtful motion.
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

        <section className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
          <div className="mb-8 flex items-center justify-between gap-6 text-sm">
            <p className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
              A note from
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-rose-500 text-white">
                <SpiderLogo className="size-3" variant="dark" decorative />
              </span>
              ctrlcat0X.
            </p>
            <time className="shrink-0 text-zinc-400" dateTime="2026-08-20">
              2026-08-20
            </time>
          </div>

          <div className="space-y-5 text-pretty text-base leading-7 text-zinc-500 dark:text-zinc-400">
            <p>
              Spider UI began after hours spent exploring component libraries;
              many were quick to impress, but just as quick to fade. Some felt
              designed for screenshots rather than real products.
            </p>
            <p>
              So I put my emphasis into{" "}
              <em className="font-serif text-zinc-700 dark:text-zinc-300">
                quality, reusability, and simplicity.
              </em>
            </p>
            <p>
              Start with the open-source{" "}
              <Link
                className="text-rose-500 hover:text-rose-400"
                href="/docs/components/primitives"
              >
                primitives
              </Link>
              , explore the{" "}
              <Link
                className="text-rose-500 hover:text-rose-400"
                href="/docs/components"
              >
                components
              </Link>
              , or discover the{" "}
              <Link
                className="text-rose-500 hover:text-rose-400"
                href="/templates"
              >
                templates
              </Link>
              . More thoughtful blocks are on the way.
            </p>
            <p>Take your time. Enjoy the visit.</p>
          </div>
        </section>

        <div className="pb-24 pt-6 sm:pb-32">
          <ShowcaseSection />
        </div>

        <section className="mx-auto max-w-2xl px-6 pb-32 pt-10 sm:pb-40">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Anything else?{" "}
              <a
                className="text-rose-500 hover:text-rose-400"
                href="mailto:hello@spiderui.dev"
              >
                Drop me an email.
              </a>
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-zinc-200/80 bg-zinc-50 px-5 dark:border-white/[0.04] dark:bg-white/[0.025]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-medium text-zinc-800 marker:content-none dark:text-zinc-200 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden
                    className="text-lg font-light text-zinc-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-xl pb-5 pr-8 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
