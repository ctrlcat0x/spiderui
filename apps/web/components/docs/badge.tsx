import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { BadgeColorsPreview } from "@/components/docs/previews/badge-colors-preview"

const importCode = `import { Badge } from "@/components/ui/badge"`

const usageCode = `export default function Page() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="red">Red</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="yellow">Yellow</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="pink">Pink</Badge>
      <Badge variant="orange">Orange</Badge>
      <Badge variant="cyan">Cyan</Badge>
      <Badge variant="indigo">Indigo</Badge>
      <Badge variant="violet">Violet</Badge>
      <Badge variant="rose">Rose</Badge>
      <Badge variant="amber">Amber</Badge>
      <Badge variant="lime">Lime</Badge>
      <Badge variant="emerald">Emerald</Badge>
      <Badge variant="sky">Sky</Badge>
      <Badge variant="slate">Slate</Badge>
      <Badge variant="fuchsia">Fuchsia</Badge>
    </div>
  )
}`

export async function BadgeDocs() {
  const sourceCode =
    (await readComponentSource("badge")) || "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Depends on{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        @base-ui/react
      </code>{" "}
      and{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        class-variance-authority
      </code>
      . Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add @base-ui/react class-variance-authority
      </code>
    </p>
  )

  return (
    <DocsPageLayout
      title="Badge"
      description="Compact label chip with eighteen color presets and utility variants. Built on Base UI."
      preview={<BadgeColorsPreview />}
      previewCode={usageCode}
      installPackageName="badge"
      installDependencies="@base-ui/react class-variance-authority clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/badge.tsx"
      installationNote={installationNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "variant",
          type: 'variant union',
          default: '"default"',
          description:
            "Visual style — secondary, destructive, outline, ghost, link, or a named color (red, blue, green, …).",
        },
        {
          name: "className",
          type: "string",
          description: "Additional class names merged onto the badge element.",
        },
        {
          name: "render",
          type: 'useRender.RenderProp<"span">',
          description:
            "Custom render prop from Base UI — render as any element via useRender.",
        },
      ]}
    />
  )
}
