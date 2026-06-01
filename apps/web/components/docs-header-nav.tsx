"use client"

import Link from "next/link"
import { FloatingDocsSidebarLazy } from "@/components/floating-docs-sidebar-lazy"
import { ComponentNavArrows } from "@/components/component-nav-arrows"
import { useDocsSidebar } from "@/components/docs-sidebar-context"
import { useDocStore } from "@/hooks/use-doc-store"

export function DocsHeaderNav({ title }: { title: string }) {
  const { isOpen } = useDocsSidebar()
  const isPreviewExpanded = useDocStore((state) => state.isPreviewExpanded)

  return (
    <div className="fixed left-1 top-3 z-50 flex w-[calc(100%-0.5rem)] items-center justify-between gap-3 pointer-events-none sm:left-3 sm:w-[calc(100%-1.5rem)] lg:absolute lg:left-6 lg:top-6 lg:w-[calc(50%-3rem)] lg:max-w-[calc(50%-1.5rem)]">
      <div className="flex min-w-0 items-center gap-2">
        <div className="pointer-events-auto shrink-0">
          <FloatingDocsSidebarLazy />
        </div>
        <div className="inline-flex h-5 min-w-0 items-center gap-2 text-[15px] font-semibold leading-none text-black/50 [font-family:ui-sans-serif,system-ui,sans-serif] pointer-events-auto dark:text-white/50 mix-blend-multiply dark:mix-blend-lighten">
          <Link
            href="/docs"
            className="shrink-0 transition-colors hover:text-black/80 dark:hover:text-white/80"
          >
            Docs
          </Link>
          <span className="shrink-0 select-none opacity-40">·</span>
          <span className="max-w-[130px] truncate sm:max-w-[220px] font-bold text-black/70 dark:text-white/70">
            {title}
          </span>
        </div>
      </div>

      {!isOpen && !isPreviewExpanded && (
        <div className="pointer-events-auto shrink-0">
          <ComponentNavArrows variant="header" />
        </div>
      )}
    </div>
  )
}
