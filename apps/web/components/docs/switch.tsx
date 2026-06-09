import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { SwitchPreview } from "@/components/docs/previews/switch-preview"

const importCode = `import { Switch } from "@/components/ui/switch"`

const usageCode = `export default function Page() {
  return <Switch defaultChecked label="Airplane Mode" />
}`

export async function SwitchDocs() {
  const sourceCode =
    (await readComponentSource("switch")) || "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      The install command adds{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        motion
      </code>{" "}
      from the registry. Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add motion
      </code>
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Liquid-glass toggle with spring thumb travel, grab-to-stretch interaction,
        and draggable scrubbing. Aesthetic inspired by{" "}
        <a
          href="https://www.apple.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Apple
        </a>{" "}
        system controls. Supports controlled and uncontrolled modes, three sizes,
        and neutral or accent tones.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Switch"
      description="Liquid-glass toggle with spring thumb motion, drag scrubbing, and grab-to-morph thumb — inspired by Apple."
      preview={<SwitchPreview />}
      previewCode={usageCode}
      installPackageName="switch"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/switch.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "checked",
          type: "boolean",
          description: "Controlled checked state.",
        },
        {
          name: "defaultChecked",
          type: "boolean",
          description: "Initial checked state when uncontrolled.",
        },
        {
          name: "onCheckedChange",
          type: "(checked: boolean) => void",
          description: "Called when the switch toggles.",
        },
        {
          name: "label",
          type: "ReactNode",
          description: "Optional label rendered beside the switch.",
        },
        {
          name: "description",
          type: "ReactNode",
          description: "Muted helper text below the label.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Track and thumb dimensions.",
        },
        {
          name: "tone",
          type: '"neutral" | "accent"',
          default: '"neutral"',
          description: "Off/on fill and glow palette — neutral uses system green when on.",
        },
        {
          name: "labelSide",
          type: '"left" | "right"',
          default: '"right"',
          description: "Which side of the switch the label appears on.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables interaction and dims the control.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the switch button.",
        },
      ]}
    />
  )
}
