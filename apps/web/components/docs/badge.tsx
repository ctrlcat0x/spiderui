import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { BadgePreview } from "@/components/docs/previews/badge-preview"
import { BadgeColorsPreview } from "@/components/docs/previews/badge-colors-preview"

const usageCode = `import { Badge } from "@/components/ui/badge"

export default function Page() {
  return <Badge variant="blue">New</Badge>
}`

const semanticVariantsCode = `<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
<Badge variant="link">Link</Badge>`

const colorVariantsCode = `<Badge variant="red">Red</Badge>
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
<Badge variant="fuchsia">Fuchsia</Badge>`

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
      description="A badge component with semantic and full-spectrum color variants built on Base UI."
      preview={<BadgePreview />}
      previewCode={usageCode}
      installPackageName="badge"
      installDependencies="@base-ui/react class-variance-authority clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/badge.tsx"
      installationNote={installationNote}
      usageCode={usageCode}
      examples={[
        {
          title: "Semantic",
          preview: <BadgePreview />,
          code: semanticVariantsCode,
        },
        {
          title: "Colors",
          preview: <BadgeColorsPreview />,
          code: colorVariantsCode,
        },
      ]}
      props={[
        {
          name: "variant",
          type: 'semantic | color variant union',
          default: '"default"',
          description:
            "Visual style — default, secondary, destructive, outline, ghost, link, or a named color (red, blue, green, …).",
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
