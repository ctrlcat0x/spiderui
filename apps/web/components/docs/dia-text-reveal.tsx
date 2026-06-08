import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  DiaTextRevealPlayground,
  DiaTextRevealPersonalizePanel,
} from "@/components/docs/previews/dia-text-reveal-playground"

const importCode = `import { DiaTextReveal } from "@/components/ui/dia-text-reveal"`

const usageCode = `export default function Page() {
  return (
    <h1 className="font-serif text-4xl font-semibold">
      <DiaTextReveal text="Spider UI" />
    </h1>
  )
}`

const usageCredits = (
  <p>
    Design inspired by{" "}
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

export async function DiaTextRevealDocs() {
  const sourceCode =
    (await readComponentSource("dia-text-reveal")) ||
    "// Unable to load source code"

  return (
    <DocsPageLayout
      title="Dia Text Reveal"
      description="A sweeping gradient band reveals text, then settles on your theme foreground color."
      preview={<DiaTextRevealPlayground />}
      personalizeContent={<DiaTextRevealPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="dia-text-reveal"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/dia-text-reveal.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      usageCredits={usageCredits}
      props={[
        {
          name: "text",
          type: "string | string[]",
          description:
            "Text to display. Use an array to rotate between strings when repeat is on.",
        },
        {
          name: "colors",
          type: "string[]",
          default: "Dia palette (5 colors)",
          description: "Colors in the sweeping gradient band.",
        },
        {
          name: "textColor",
          type: "string",
          default: '"var(--foreground)"',
          description: "Solid text color after the animation completes.",
        },
        {
          name: "duration",
          type: "number",
          default: "1.5",
          description: "Sweep duration in seconds.",
        },
        {
          name: "delay",
          type: "number",
          default: "0",
          description: "Delay before the sweep starts, in seconds.",
        },
        {
          name: "repeat",
          type: "boolean",
          default: "false",
          description:
            "When text is an array, advance to the next string after each cycle.",
        },
        {
          name: "repeatDelay",
          type: "number",
          default: "0.5",
          description: "Pause in seconds before replaying or advancing.",
        },
        {
          name: "startOnView",
          type: "boolean",
          default: "true",
          description: "Start the animation when the element enters the viewport.",
        },
        {
          name: "once",
          type: "boolean",
          default: "true",
          description: "Play only the first time when using in-view detection.",
        },
        {
          name: "fixedWidth",
          type: "boolean",
          default: "false",
          description:
            "Lock width to the widest string when text is an array to reduce layout shift.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional CSS classes on the root span.",
        },
      ]}
    />
  )
}
