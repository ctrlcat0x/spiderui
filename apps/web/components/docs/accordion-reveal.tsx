import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  AccordionRevealPlayground,
  AccordionRevealPersonalizePanel,
} from "@/components/docs/previews/accordion-reveal-playground"

const importCode = `import { AccordionReveal } from "@/components/ui/accordion-reveal"`

const usageCode = `export default function Page() {
  return (
    <div className="max-w-xl text-foreground">
      <AccordionReveal />
    </div>
  )
}`

export async function AccordionRevealDocs() {
  const sourceCode =
    (await readComponentSource("accordion-reveal")) ||
    "// Unable to load source code"

  return (
    <DocsPageLayout
      title="Accordion Reveal"
      description="A vertical list of rows that expand on hover to reveal full-bleed imagery, labels, and descriptions."
      scrollablePreview
      preview={<AccordionRevealPlayground />}
      personalizeContent={<AccordionRevealPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="accordion-reveal"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/accordion-reveal.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "items",
          type: "AccordionRevealItem[]",
          default: "5 film & TV picks",
          description:
            "Row data with label, sublabel, image, optional alt text, and description.",
        },
        {
          name: "collapsedHeight",
          type: "number",
          default: "68",
          description: "Row height in pixels when collapsed.",
        },
        {
          name: "expandedHeight",
          type: "number",
          default: "320",
          description: "Row height in pixels when hovered.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the root wrapper.",
        },
      ]}
    />
  )
}
