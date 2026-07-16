import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  FanCardsPlayground,
  FanCardsPersonalizePanel,
} from "@/components/docs/previews/fan-cards-playground"

const importCode = `import { FanCards } from "@/components/ui/fan-cards"`

const usageCode = `import { FanCards } from "@/components/ui/fan-cards"

export default function Page() {
  return (
    <FanCards
      spread={100}
      rotateStep={10}
      springStiffness={260}
      springDamping={26}
    />
  )
}`

export async function FanCardsDocs() {
  const sourceCode =
    (await readComponentSource("fan-cards")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Click another card to switch focus, or click outside / the active card
        again to return to the fan. Tune spread, rotation, and spring feel in the
        personalize panel.
      </p>
      <p>
        Design inspired by{" "}
        <a
          href="https://www.interfacecraft.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Interface Craft
        </a>
        .
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Fan Cards"
      description="An editorial card fan with spring focus, serif titles, and a receding deck on select."
      scrollablePreview
      preview={<FanCardsPlayground />}
      personalizeContent={<FanCardsPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="fan-cards"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/fan-cards.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "cards",
          type: "FanCardItem[]",
          description:
            "Card data with title, subtitle, background/text colors, optional top content slot, default rotation, and stack index.",
        },
        {
          name: "spread",
          type: "number",
          default: "100",
          description: "Horizontal spacing between cards in the fan state.",
        },
        {
          name: "rotateStep",
          type: "number",
          default: "10",
          description: "Rotation increment per card in the fan state.",
        },
        {
          name: "springStiffness",
          type: "number",
          default: "260",
          description: "Spring stiffness for layout transitions.",
        },
        {
          name: "springDamping",
          type: "number",
          default: "26",
          description: "Spring damping for layout transitions.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the outer wrapper.",
        },
      ]}
    />
  )
}
