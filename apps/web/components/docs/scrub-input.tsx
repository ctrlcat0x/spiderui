import React from "react"
import { ScrubInputDemo, ScrubInputMultipleDemo } from "@/components/docs/previews/scrub-input-preview"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"

const importCode = `import { ScrubInput } from "@/components/ui/scrub-input"`

const usageCode = `import { useState } from "react"

export function Demo() {
  const [opacity, setOpacity] = useState(44)

  return (
    <ScrubInput
      label="Opacity"
      value={opacity}
      onChange={setOpacity}
      min={0}
      max={100}
    />
  )
}`

const multipleCode = `import { useState } from "react"

export function SettingsDemo() {
  const [radius, setRadius] = useState(12)
  const [blur, setBlur] = useState(24)

  return (
    <div className="flex flex-col gap-4">
      <ScrubInput
        label="Border Radius"
        value={radius}
        onChange={setRadius}
        min={0}
        max={100}
      />
      <ScrubInput
        label="Blur"
        value={blur}
        onChange={setBlur}
        min={0}
        max={50}
      />
    </div>
  )
}`

export async function ScrubInputDocs() {
  const sourceCode =
    (await readComponentSource("scrub-input")) ||
    "// Unable to load source code"

  return (
    <DocsPageLayout
      title="Scrub Input"
      description="Pill-shaped inline slider for scrubbing numeric values — drag anywhere on the track to adjust, like a design tool property control."
      preview={<ScrubInputDemo />}
      previewCode={usageCode}
      installPackageName="scrub-input"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/scrub-input.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Multiple Inputs",
          preview: <ScrubInputMultipleDemo />,
          code: multipleCode,
        },
      ]}
      props={[
        {
          name: "label",
          type: "string",
          description: "Label shown on the left side of the track.",
        },
        {
          name: "value",
          type: "number",
          description: "Controlled value.",
        },
        {
          name: "defaultValue",
          type: "number",
          default: "0",
          description: "Initial value when uncontrolled.",
        },
        {
          name: "onChange",
          type: "(value: number) => void",
          description: "Called when the scrubbed value changes.",
        },
        {
          name: "min",
          type: "number",
          default: "0",
          description: "Minimum allowed value.",
        },
        {
          name: "max",
          type: "number",
          default: "100",
          description: "Maximum allowed value.",
        },
        {
          name: "step",
          type: "number",
          default: "1",
          description: "Snap increment while scrubbing.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the root element.",
        },
      ]}
    />
  )
}
