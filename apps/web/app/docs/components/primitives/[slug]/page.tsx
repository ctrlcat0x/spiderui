import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import {
  getComponent,
  getComponentDocsHref,
  getPrimitiveSlugs,
  isPrimitiveComponent,
} from "@/registry"
import { getDocsImporter } from "@/components/docs/lazy-registry"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { openGraphImages, ogImage } from "@/lib/site"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return getPrimitiveSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const component = getComponent(params.slug)

  if (!component || !isPrimitiveComponent(params.slug)) {
    return {}
  }

  const docsHref = getComponentDocsHref(component.slug)

  return {
    title: `${component.title} Component`,
    description: component.description,
    alternates: {
      canonical: `https://spiderui.dev${docsHref}`,
    },
    openGraph: {
      title: `${component.title} Component`,
      description: component.description,
      images: [...openGraphImages],
    },
    twitter: {
      card: "summary_large_image",
      title: `${component.title} Component`,
      description: component.description,
      images: [ogImage.path],
    },
  }
}

function DocsPageSkeleton() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#f3f4f6] dark:bg-[#080808] lg:h-screen lg:flex-row">
      <div className="relative z-20 flex h-full w-full flex-col bg-[#f3f4f6] dark:bg-[#080808] lg:max-w-1/2 lg:basis-1/2">
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-30 h-40 bg-gradient-to-b from-[#f3f4f6] via-[#f3f4f6] to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_bottom,black_20%,transparent)] dark:from-[#080808] dark:via-[#080808]" />
        <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto w-full max-w-3xl animate-pulse space-y-20 px-8 pt-32 pb-40 lg:px-16 lg:pt-48">
            <div className="space-y-6">
              <div className="h-12 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-6 w-full rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50" />
            </div>
          </div>
        </div>
      </div>
      <div className="order-first z-10 flex flex-1 flex-col bg-[#f3f4f6] dark:bg-[#080808] lg:sticky lg:top-0 lg:order-last lg:h-full lg:max-w-1/2 lg:basis-1/2">
        <div className="relative h-[400px] w-full overflow-hidden p-4 lg:h-full">
          <div className="h-full w-full animate-pulse rounded-xl border border-zinc-200 bg-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-800/20" />
        </div>
      </div>
    </div>
  )
}

async function DocsContent({ slug }: { slug: string }) {
  const importer = getDocsImporter(slug)

  if (!importer) {
    return null
  }

  const docModule = await importer()
  const DocsComponent = "default" in docModule ? docModule.default : null

  if (!DocsComponent) {
    return null
  }

  return <DocsComponent />
}

export default async function PrimitiveComponentPage(props: PageProps) {
  const params = await props.params
  const component = getComponent(params.slug)

  if (!component || !isPrimitiveComponent(params.slug)) {
    return notFound()
  }

  const importer = getDocsImporter(params.slug)

  if (importer) {
    return (
      <Suspense fallback={<DocsPageSkeleton />}>
        <DocsContent slug={params.slug} />
      </Suspense>
    )
  }

  return (
    <DocsPageLayout
      title={component.title}
      description={component.description}
      installPackageName={component.slug}
      preview={
        <div className="flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/20 p-12">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">{component.title} Preview</h3>
            <p className="text-sm text-muted-foreground">
              Component preview will appear here.
            </p>
          </div>
        </div>
      }
      previewCode="// Preview code coming soon"
      usageCode="// Usage examples coming soon"
      examples={[]}
      props={[]}
    />
  )
}
