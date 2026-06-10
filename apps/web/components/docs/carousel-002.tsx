import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Carousel002Preview } from "@/components/docs/previews/carousel-002-preview"

const importCode = `import { Carousel002 } from "@/components/ui/carousel-002"`

const usageCode = `import { Carousel002 } from "@/components/ui/carousel-002"

export default function Page() {
  return (
    <Carousel002
      title="From concept to market: how we built a timeless brand identity."
      subtitle="A split editorial carousel with timed progress pills and blur-fade transitions."
      slides={[
        {
          id: "one",
          imageSrc:
            "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp&w=1200",
          imageAlt: "Neon signal in darkness",
        },
        {
          id: "two",
          imageSrc:
            "https://cdn.cosmos.so/6d05ef91-722e-4fcc-83c5-765e348ec644?format=webp&w=1200",
          imageAlt: "Atmospheric horizon scene",
        },
      ]}
    />
  )
}`

const usageCredits = (
  <p>
  Split editorial layout inspired by agency case-study carousels. Images from{" "}
  <a
    href="https://www.cosmos.so/"
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-foreground underline underline-offset-2"
  >
    Cosmos
  </a>
  .
  </p>
)

export async function Carousel002Docs() {
  const sourceCode =
    (await readComponentSource("carousel-002")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Fifty-fifty split carousel: title and subtitle stack on the left, square
        image on the right. Large arrow buttons and long progress pills sit on
        the bottom-left baseline. The active pill fills over 4 seconds, then
        resets and advances — images cross-fade with blur. Arrows and pills use
        spring scale feedback on interaction.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Carousel 002"
      description="Split editorial carousel with large arrow controls, timed progress pills, and blur-fade image transitions."
      preview={<Carousel002Preview />}
      previewCode={usageCode}
      installPackageName="carousel-002"
      installDependencies="motion @hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/carousel-002.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      usageCredits={usageCredits}
      fullWidthPreview
      props={[
        {
          name: "title",
          type: "string",
          description: "Large serif heading in the left column.",
        },
        {
          name: "subtitle",
          type: "string",
          description: "Supporting body copy below the title.",
        },
        {
          name: "slides",
          type: "Carousel002Slide[]",
          default: "DEFAULT_CAROUSEL_002_SLIDES",
          description: "Image slides — id, src, and optional alt text.",
        },
        {
          name: "interval",
          type: "number",
          default: "4000",
          description:
            "Milliseconds for each pill to fill before auto-advancing.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the root section.",
        },
      ]}
    />
  )
}
