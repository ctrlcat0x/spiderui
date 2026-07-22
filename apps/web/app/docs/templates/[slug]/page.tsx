import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink, GitBranch } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade"
import { CodeBlock } from "@/components/docs/code-block"
import { CodeInline, Section } from "@/components/component-layout"
import { getAllTemplates, getTemplate } from "@/registry/templates"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllTemplates().map((template) => ({ slug: template.slug }))
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params
  const template = getTemplate(slug)

  if (!template) {
    notFound()
  }

  const cloneCommand = `git clone ${template.repoUrl}.git`
  const repoName = template.repoUrl.split("/").pop() ?? "my-app"

  return (
    <div className="min-h-screen bg-white dark:bg-[#111] text-zinc-900 dark:text-zinc-100 font-sans overflow-x-hidden">
      <ScrollEdgeFade position="top" variant="docs-index" className="fixed z-40" />
      <ScrollEdgeFade position="bottom" variant="docs-index" className="fixed z-40" />

      <SiteHeader />

      <main className="max-w-3xl mx-auto pt-32 pb-32 px-6 sm:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/docs/templates"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            ← All templates
          </Link>
        </div>

        <header className="mb-10 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter bg-gradient-to-br from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white bg-clip-text text-transparent leading-[1.1]">
            {template.title}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {template.description}
          </p>
        </header>

        <div className="mb-8 overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={template.heroImage}
              alt={template.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </div>

        <div className="mb-16 flex flex-wrap gap-3">
          <a
            href={template.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            <GitBranch className="h-4 w-4" aria-hidden />
            Get code
          </a>
          <a
            href={template.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Live preview
          </a>
        </div>

        <div className="space-y-16">
          <Section title="What is this?" id="what-is-this" className="pt-2">
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {template.whatIsThis}
            </p>
            {template.stack && template.stack.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {template.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </Section>

          {template.whoIsFor && (
            <Section title="Who is this for?" id="who-is-this-for" className="pt-2">
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {template.whoIsFor}
              </p>
            </Section>
          )}

          <Section title="Installation" id="installation" className="pt-2">
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Clone repository
                </h3>
                <CodeBlock code={cloneCommand} />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Install dependencies
                </h3>
                <CodeBlock code={`cd ${repoName}\npnpm install`} />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Run dev server
                </h3>
                <CodeBlock code="pnpm dev" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Open{" "}
                  <CodeInline>http://localhost:3000</CodeInline>{" "}
                  in your browser.
                </p>
              </div>
            </div>
          </Section>
        </div>
      </main>
    </div>
  )
}
