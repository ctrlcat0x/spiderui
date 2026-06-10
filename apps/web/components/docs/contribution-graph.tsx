import React from "react"
import {
  ContributionGraphPlayground,
  ContributionGraphPersonalizePanel,
} from "@/components/docs/previews/contribution-graph-preview"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"

const importCode = `import { ContributionGraph } from "@/components/ui/contribution-graph"`

const usageCode = `export function Demo() {
  return (
    <ContributionGraph
      username="torvalds"
      theme="sakura"
      variant="city-lights"
      animation="left-to-right"
      glowIntensity={6}
    />
  )
}`

export async function ContributionGraphDocs() {
  const sourceCode =
    (await readComponentSource("contribution-graph")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Depends on{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        motion
      </code>
      ,{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        radix-ui
      </code>
      . Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add motion radix-ui
      </code>
    </p>
  )

  return (
    <DocsPageLayout
      title="Contribution Graph"
      description="GitHub-style activity heatmap with month/day labels, seven color themes, city-lights glow, and staggered load-in animations."
      preview={<ContributionGraphPlayground />}
      personalizeContent={<ContributionGraphPersonalizePanel />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="contribution-graph"
      installDependencies="motion radix-ui clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/contribution-graph.tsx"
      installationNote={installationNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "username",
          type: "string",
          description:
            "GitHub username — fetches last-year contributions from github-contributions-api.",
        },
        {
          name: "data",
          type: "ActivityEntry[]",
          description:
            "Optional flat array of { date, count }. Use instead of username for custom data.",
        },
        {
          name: "theme",
          type: '"green" | "orange" | "sakura" | "autumn" | "winter" | "forest" | "grayscale"',
          default: '"green"',
          description: "Color palette for contribution intensity levels.",
        },
        {
          name: "variant",
          type: '"default" | "city-lights" | "minimal"',
          default: '"default"',
          description:
            "Visual style — city-lights adds neon glow; minimal shrinks cells to dots.",
        },
        {
          name: "animation",
          type: '"left-to-right" | "top-to-bottom" | "random" | "none"',
          default: '"left-to-right"',
          description: "Staggered load-in animation pattern for grid cells.",
        },
        {
          name: "shape",
          type: '"square" | "rounded" | "circle" | "squircle"',
          default: '"rounded"',
          description: "Cell corner style.",
        },
        {
          name: "glowIntensity",
          type: "number",
          default: "5",
          description: "Glow radius for city-lights variant.",
        },
        {
          name: "blockSize",
          type: "number",
          description: "Fixed cell size in px. Omit to auto-fit container width.",
        },
        {
          name: "showHeader",
          type: "boolean",
          default: "true",
          description: "Show GitHub username and total contribution count.",
        },
        {
          name: "showLegend",
          type: "boolean",
          default: "true",
          description: "Show Less/More intensity legend.",
        },
        {
          name: "showLabels",
          type: "boolean",
          default: "true",
          description: "Show month and day-of-week axis labels.",
        },
      ]}
    />
  )
}
