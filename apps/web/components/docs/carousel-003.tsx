import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Carousel003Preview } from "@/components/docs/previews/carousel-003-preview"

const importCode = `import { Carousel003 } from "@/components/ui/carousel-003"`

const usageCode = `export default function Page() {
  return (
    <Carousel003
      title="Our Creative Gallery"
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
    Gallery carousel layout inspired by creative portfolio showcases. Images
    from{" "}
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

export async function Carousel003Docs() {
  const sourceCode =
    (await readComponentSource("carousel-003")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Gallery carousel with a top-left title, horizontal slide transitions
        (exit left, enter right) with blur, and glass pills below the image.
        The active dot expands and fills on a timer like Carousel 001 — click
        any dot to jump. Auto-advance stops on the final slide; the control
        button cycles pause, play, and replay depending on state. Pills share
        the same height and lift slightly into the image on scroll.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Carousel 003"
      description="Gallery carousel with floating pill controls, expanding dot timer, pause/replay, and horizontal blur-slide transitions."
      preview={<Carousel003Preview />}
      previewCode={usageCode}
      installPackageName="carousel-003"
      installDependencies="motion @hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/carousel-003.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      usageCredits={usageCredits}
      scrollablePreview
      props={[
        {
          name: "title",
          type: "string",
          description: "Heading at the top left of the carousel.",
        },
        {
          name: "slides",
          type: "Carousel003Slide[]",
          default: "DEFAULT_CAROUSEL_003_SLIDES",
          description: "Slide data with image src and optional alt text.",
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
