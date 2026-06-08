import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { CardStroke } from "@workspace/ui/components/card-stroke"
import {
  CardStrokePlayground,
  CardStrokePersonalizePanel,
} from "@/components/docs/previews/card-stroke-playground"

const defaultImage =
  "https://images.unsplash.com/photo-1773058373644-74e4120bfc77?q=80&w=1200&auto=format&fit=crop"

const importCode = `import { CardStroke } from "@/components/ui/card-stroke"`

const usageCode = `export default function Page() {
  return (
    <CardStroke
      title="Card Title"
      description="A small two line paragraph passed by prop."
      imageSrc="${defaultImage}"
      imageAlt="Placeholder preview image"
      accentStrokeColor="#E0E0E0"
      baseStrokeColor="#2B7FFF"
      textColor="#F5F5F5"
    />
  )
}`

const customColorsCode = `export default function Page() {
  return (
    <CardStroke
      title="Dark Accent"
      description="Custom stroke and text colors."
      accentStrokeColor="#00E5FF"
      baseStrokeColor="#7C3AED"
      textColor="#FFFFFF"
    />
  )
}`

const customStylingCode = `export default function Page() {
  return (
    <CardStroke
      title="Rounded Card"
      description="Extended styling using className."
      className="shadow-2xl ring-1 ring-white/10"
    />
  )
}`

export async function CardStrokeDocs() {
  const sourceCode =
    (await readComponentSource("card-stroke")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      The install command also adds{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        gsap
      </code>{" "}
      from the registry (includes SplitText). Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add gsap
      </code>
    </p>
  )

  const usageNote = (
    <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Uses <strong className="text-foreground">GSAP SplitText</strong> for
        word-by-word reveals on hover. Inspired by{" "}
        <a
          href="https://x.com/joaopaulots/status/2019123435310596275"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          joaopaulots
        </a>
        .
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Card Stroke"
      description="Card with animated SVG strokes and word-by-word text reveal on hover."
      preview={<CardStrokePlayground />}
      personalizeContent={<CardStrokePersonalizePanel />}
      previewCode={usageCode}
      installPackageName="card-stroke"
      installDependencies="gsap clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/card-stroke.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Custom Colors",
          preview: (
            <div className="mx-auto w-full max-w-xl p-6">
              <CardStrokePlayground
                config={{
                  title: "Dark Accent",
                  description: "Custom stroke and text colors.",
                  accentStrokeColor: "#00E5FF",
                  baseStrokeColor: "#7C3AED",
                  textColor: "#FFFFFF",
                }}
              />
            </div>
          ),
          code: customColorsCode,
        },
        {
          title: "Custom Styling",
          preview: (
            <div className="mx-auto w-full max-w-xl p-6">
              <CardStroke
                className="shadow-2xl ring-1 ring-white/10"
                title="Rounded Card"
                description="Extended styling using className."
              />
            </div>
          ),
          code: customStylingCode,
        },
      ]}
      props={[
        {
          name: "title",
          type: "string",
          default: '"Card Title"',
          description: "Heading at the bottom-left of the card.",
        },
        {
          name: "description",
          type: "string",
          default: '"A small two line paragraph passed by prop."',
          description: "Supporting text below the title.",
        },
        {
          name: "imageSrc",
          type: "string",
          description: "Background image URL.",
        },
        {
          name: "imageAlt",
          type: "string",
          default: '"Card background"',
          description: "Alt text for the background image.",
        },
        {
          name: "accentStrokeColor",
          type: "string",
          default: '"#E0E0E0"',
          description: "Color of the first animated SVG stroke.",
        },
        {
          name: "baseStrokeColor",
          type: "string",
          default: '"#2B7FFF"',
          description: "Color of the second animated SVG stroke.",
        },
        {
          name: "textColor",
          type: "string",
          default: '"#F5F5F5"',
          description: "Title and description text color.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the root container.",
        },
      ]}
    />
  )
}
