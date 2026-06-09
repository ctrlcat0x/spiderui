import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Carousel001Preview } from "@/components/docs/previews/carousel-001-preview"

const importCode = `import { Carousel001 } from "@/components/ui/carousel-001"`

const usageCode = `export default function Page() {
  return (
    <Carousel001
      title="Stories in motion"
      subtitle="Editorial highlights for launches, moods, and moments"
      slides={[
        {
          id: "one",
          imageSubtitle: "Light cuts through the noise",
          imageSrc:
            "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp&w=1200",
          imageAlt: "Neon signal in darkness",
        },
        {
          id: "two",
          imageSubtitle: "Where color meets atmosphere",
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
    Carousel layout, pill timer pagination, and blur-fade slide transitions
    inspired by{" "}
    <a
      href="https://www.diabrowser.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-foreground underline underline-offset-2"
    >
      Dia Browser
    </a>
    .
  </p>
)

export async function Carousel001Docs() {
  const sourceCode =
    (await readComponentSource("carousel-001")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Centered hero carousel with title, subtitle, arrow controls, and pill
        pagination where the active dot expands and fills on a timer. Slides
        auto-advance every 4 seconds by default — current content exits left
        with blur while the next enters from the right.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Carousel 001"
      description="Hero carousel with pill timer pagination, arrow controls, and blur-fade slide transitions."
      preview={<Carousel001Preview />}
      previewCode={usageCode}
      installPackageName="carousel-001"
      installDependencies="motion @hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/carousel-001.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      usageCredits={usageCredits}
      scrollablePreview
      props={[
        {
          name: "title",
          type: "string",
          description: "Main heading above the carousel.",
        },
        {
          name: "subtitle",
          type: "string",
          description: "Supporting text below the title.",
        },
        {
          name: "slides",
          type: "Carousel001Slide[]",
          default: "DEFAULT_CAROUSEL_001_SLIDES",
          description:
            "Slide data with image subtitle, src, and optional alt text.",
        },
        {
          name: "interval",
          type: "number",
          default: "4000",
          description: "Auto-advance interval in milliseconds.",
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
