"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

import { CopyButton } from "@/components/copy-button";

const installCommand = "pnpm dlx shadcn@latest add @spiderui/name";

export function HeroButtons() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 pb-2 pt-6 sm:flex-row">
      <motion.div whileTap={{ scale: 0.98 }}>
        <div className="group relative inline-flex h-12 max-w-[calc(100vw-2.5rem)] items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#E3E3E3]/80 px-4 text-sm font-semibold text-zinc-900 shadow-[0_2px_4px_0_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.16),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-xl transition-all duration-300 hover:px-6 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.16),inset_0_1px_0_0_rgba(255,255,255,1)] dark:bg-zinc-800/80 dark:text-zinc-100 dark:shadow-[0_2px_4px_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)]">
          <Terminal className="size-4 shrink-0 text-zinc-600 dark:text-zinc-400" />
          <span className="max-w-[210px] truncate whitespace-nowrap font-mono text-sm tracking-tight text-zinc-700 dark:text-zinc-400 sm:max-w-[360px]">
            {installCommand}
          </span>
          <CopyButton
            code={installCommand}
            absolute={false}
            className="p-1.5"
          />
        </div>
      </motion.div>

      <motion.div
        whileTap={{ scale: 0.98 }}
        className="relative z-10 w-full sm:w-fit"
      >
        <Link
          href="/docs"
          className="group relative inline-flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-zinc-900/90 px-4 text-sm font-semibold text-zinc-100 shadow-[0_2px_4px_0_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300 hover:px-6 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.14),inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:bg-[#E3E3E3]/80 dark:text-zinc-900 dark:shadow-[0_2px_4px_0_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.16),inset_0_1px_0_0_rgba(255,255,255,1)] dark:hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.16),inset_0_1px_0_0_rgba(255,255,255,1)] sm:w-fit"
        >
          <span className="text-sm font-medium tracking-tight text-zinc-100 dark:text-zinc-700">
            Documentation
          </span>
          <ArrowRight className="size-4 text-zinc-400 dark:text-zinc-600" />
        </Link>
      </motion.div>
    </div>
  );
}
