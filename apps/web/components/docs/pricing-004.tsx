import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing004Preview } from "@/components/docs/previews/pricing-004-preview"

const importCode = `import { Pricing004 } from "@/components/ui/pricing-004"`

const usageCode = `export default function Page() {
  return <Pricing004 />
}`

export async function Pricing004Docs() {
  const sourceCode =
    (await readComponentSource("pricing-004")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Requires shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>{" "}
      and{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        badge
      </code>{" "}
      registry items.
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Horizontal plan cards with a gradient accent blob, strikethrough{" "}
        <code className="text-foreground">originalPrice</code>, and optional{" "}
        <code className="text-foreground">recommended</code> badge. Accent colours:{" "}
        <code className="text-foreground">neutral</code>,{" "}
        <code className="text-foreground">orange</code>,{" "}
        <code className="text-foreground">blue</code>,{" "}
        <code className="text-foreground">violet</code>,{" "}
        <code className="text-foreground">emerald</code>,{" "}
        <code className="text-foreground">rose</code>,{" "}
        <code className="text-foreground">yellow</code>.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Pricing 004"
      description="List-style pricing cards with accent icon blobs, strikethrough prices, and recommended badges."
      preview={<Pricing004Preview />}
      previewCode={usageCode}
      installPackageName="pricing-004"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-004.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      scrollablePreview
      props={[
        {
          name: "plans",
          type: "Plan4[]",
          default: "DEFAULT_PLANS_4",
          description:
            "Plan objects with features, price strings, CTA, accent colour, and optional recommended badge.",
        },
        {
          name: "title",
          type: "string",
          default: '"Organize without limits"',
          description: "Header title above the plan list.",
        },
        {
          name: "subtitle",
          type: "string",
          default: '"Local or cloud — your choice"',
          description: "Subtitle below the header.",
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
