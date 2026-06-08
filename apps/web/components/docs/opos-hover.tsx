import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { OposHoverPreview } from "@/components/docs/previews/opos-hover-preview"

const importCode = `import { OposHover } from "@/components/ui/opos-hover"`

const usageCode = `const quoteWords = [
  { id: 1, name: "SHOW", image: "/quotes/show.jpg" },
  { id: 2, name: "ME", image: "/quotes/me.jpg" },
  { id: 3, name: "THE", image: "/quotes/the.jpg" },
  { id: 4, name: "MONEY", image: "/quotes/money.jpg" },
]

export default function Page() {
  return <OposHover items={quoteWords} title="Weeeeeeeee!" />
}`

export async function OposHoverDocs() {
  const sourceCode =
    (await readComponentSource("opos-hover")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Requires{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        gsap
      </code>{" "}
      with SplitText. Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add gsap
      </code>
    </p>
  )

  const usageNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Hover interaction inspired by{" "}
      <Link
        href="https://opos.buzzworthystudio.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline underline-offset-4"
      >
        OPOS
      </Link>
      . Each thumbnail is one word of a quote; the giant title swaps with per-character GSAP reveals.
    </p>
  )

  return (
    <DocsPageLayout
      title="OPOS Hover"
      description="Thumbnail strip with a giant headline that swaps to each quote word on hover, plus a lagging cursor dot and bubble."
      preview={<OposHoverPreview />}
      previewCode={usageCode}
      installPackageName="opos-hover"
      installDependencies="gsap clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/opos-hover.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      fullWidthPreview
      props={[
        {
          name: "items",
          type: "QuoteWordItem[]",
          default: "DEFAULT_QUOTE_WORDS",
          description: "Thumbnails and the word revealed on hover.",
        },
        {
          name: "title",
          type: "string",
          default: "Weee!",
          description: "Default headline shown when nothing is hovered.",
        },
        {
          name: "accentColor",
          type: "string",
          default: "#ff2d1f",
          description: "Active word colour, thumbnail outline, and cursor bubble.",
        },
        {
          name: "titleClassName",
          type: "string",
          description: "Override headline size (useful in narrow preview panes).",
        },
        {
          name: "header",
          type: "ReactNode",
          description: "Optional slot above the thumbnail strip (e.g. nav or branding).",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the root container.",
        },
      ]}
    />
  )
}
