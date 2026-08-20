"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

import { CopyButton } from "@/components/copy-button";

const installCommand = "pnpm dlx shadcn@latest add @spiderui/name";

export function HeroButtons() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <motion.div whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
        <div className="flex h-11 max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-100 px-3 text-zinc-600 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.045] dark:text-zinc-400">
          <Terminal aria-hidden className="size-3.5 shrink-0" />
          <code className="truncate font-mono text-xs sm:text-sm">
            {installCommand}
          </code>
          <CopyButton
            code={installCommand}
            absolute={false}
            className="shrink-0 p-1.5"
          />
        </div>
      </motion.div>

      <motion.div whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
        <Link
          href="/docs"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Documentation
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </motion.div>
    </div>
  );
}
