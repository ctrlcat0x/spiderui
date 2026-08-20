"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StickerTrailPreview } from "@/components/docs/previews/sticker-trail-playground";
import { SwitchPreview } from "@/components/docs/previews/switch-preview";
import { BounceSidebarPreview } from "@/components/docs/previews/bounce-sidebar-preview";
import { WheelDatePickerPreview } from "@/components/docs/previews/wheel-date-picker-preview";
import { CardStroke } from "@workspace/ui/components/card-stroke";
import { SectionHeading } from "@/components/landing/section-heading";

const showcaseCardClass =
  "group relative flex flex-col rounded-2xl border border-border bg-white dark:bg-[#1a1a1a] p-2 shadow-card transition-all duration-300 hover:border-input hover:shadow-card-hover";

const showcasePreviewClass =
  "relative w-full overflow-hidden rounded-xl border border-dashed border-border bg-zinc-50 dark:bg-[#111] shadow-surface-inset transition-colors";

const showcaseItems = [
  {
    href: "/docs/components/sticker-trail",
    title: "Sticker trail",
    description: "Cursor-following sticker burst with physics.",
    className: "md:col-span-2",
    previewClassName: "min-h-[340px] md:min-h-[380px]",
    preview: <StickerTrailPreview />,
  },
  {
    href: "/docs/components/primitives/switch",
    title: "Switch",
    description: "Spring-animated toggle with size and tone variants.",
    className: "md:col-span-1",
    previewClassName: "min-h-[300px] md:min-h-[340px]",
    preview: <SwitchPreview />,
  },
  {
    href: "/docs/components/card-stroke",
    title: "Card stroke",
    description: "GSAP split-text card with animated border strokes.",
    className: "md:col-span-1",
    previewClassName:
      "min-h-[300px] md:min-h-[340px] flex items-center justify-center p-4",
    preview: (
      <div className="flex h-full w-full items-center justify-center p-4">
        <CardStroke className="w-full max-w-[260px]" />
      </div>
    ),
  },
  {
    href: "/docs/components/wheel-date-picker",
    title: "Wheel date picker",
    description:
      "Inertial date wheels with depth, snapping, and keyboard control.",
    className: "md:col-span-1",
    previewClassName: "min-h-[360px] md:min-h-[440px]",
    preview: <WheelDatePickerPreview />,
  },
  {
    href: "/docs/components/bounce-sidebar",
    title: "Bounce sidebar",
    description: "Navigation with a springing, curved active indicator.",
    className: "md:col-span-1",
    previewClassName: "min-h-[360px] md:min-h-[440px]",
    preview: <BounceSidebarPreview />,
  },
] as const;

export function ShowcaseSection() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4">
      <SectionHeading
        eyebrow="Featured"
        title="Components with personality"
        description="A taste of what's in the library — interactive, polished, and ready to paste into your project."
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
      >
        {showcaseItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${item.className} ${showcaseCardClass}`}
          >
            <div className={`${showcasePreviewClass} ${item.previewClassName}`}>
              {item.preview}
            </div>
            <div className="shrink-0 px-3 pb-2 pt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {item.title}
                </p>
                <ArrowRight className="size-3.5 shrink-0 text-zinc-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-500" />
              </div>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 flex justify-center"
      >
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-zinc-100 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
        >
          Browse all components
          <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>
    </section>
  );
}
