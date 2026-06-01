import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade"
import { getAllTemplates } from "@/registry/templates"

export default function TemplatesPage() {
  const items = getAllTemplates()

  return (
    <div className="min-h-screen bg-white dark:bg-[#111] text-zinc-900 dark:text-zinc-100 font-sans overflow-x-hidden">
      <ScrollEdgeFade position="top" variant="docs-index" className="fixed z-40" />
      <ScrollEdgeFade position="bottom" variant="docs-index" className="fixed z-40" />

      <SiteHeader />

      <main className="max-w-[1400px] mx-auto pt-32 pb-32 px-6 sm:px-8 relative z-10">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter bg-gradient-to-br from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white bg-clip-text text-transparent leading-[1.1] mb-2 inline-block">
            Templates
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Full starter projects you can clone, customize, and ship.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-zinc-50/50 dark:bg-zinc-900/30 px-8 py-16 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Templates are on the way. Add entries in{" "}
              <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                apps/web/registry/templates.ts
              </code>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((template) => (
              <Link
                key={template.slug}
                href={`/docs/templates/${template.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-white dark:bg-zinc-900/50 overflow-hidden transition-all duration-300 shadow-card hover:-translate-y-0.5 hover:border-input hover:shadow-card-hover"
              >
                <div className="p-1.5">
                  <div className="relative h-[220px] w-full rounded-xl border border-dashed border-border overflow-hidden bg-zinc-50 dark:bg-zinc-900/80">
                    <Image
                      src={template.heroImage}
                      alt={template.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 px-4 pb-4 pt-2">
                  <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {template.title}
                  </h2>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
