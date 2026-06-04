import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing2Preview } from "@/components/docs/previews/pricing-2-preview"

const usageCode = `import { Pricing2 } from "@/components/ui/pricing-2"

export default function Page() {
  return <Pricing2 />
}`

export async function Pricing2Docs() {
  const sourceCode =
    (await readComponentSource("pricing-2")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Depends on the shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>{" "}
      registry item. CTAs use native{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        &lt;a&gt;
      </code>{" "}
      tags with <code className="text-foreground">Button asChild</code> for framework-agnostic installs.
    </p>
  )

  const usageNote = (
    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
      <li>
        Featured plan uses a gradient border (<code className="text-foreground">p-0.5</code> trick) with a{" "}
        <code className="text-foreground">bg-card</code> inner shell.
      </li>
      <li>
        &quot;Most Popular&quot; pill is absolutely positioned with a negative top offset.
      </li>
      <li>
        Decorative cursor SVG is pinned to the bottom-right of the featured card.
      </li>
      <li>Non-featured plans use <code className="text-foreground">ring-1 ring-foreground/10</code>.</li>
      <li>
        For Next.js App Router, replace <code className="text-foreground">&lt;a&gt;</code> with{" "}
        <code className="text-foreground">&lt;Link&gt;</code> if you prefer client-side navigation.
      </li>
    </ul>
  )

  return (
    <DocsPageLayout
      title="Pricing 2"
      description="Three-column pricing section with a gradient-bordered featured card and an illustrated cursor SVG decoration."
      preview={<Pricing2Preview />}
      previewCode={usageCode}
      installPackageName="pricing-2"
      installDependencies="@hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-2.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "plans",
          type: "Plan2[]",
          default: "DEFAULT_PLANS_2",
          description: "Array of pricing plans to display.",
        },
        {
          name: "className",
          type: "string",
          description: "Extra classes applied to the grid container.",
        },
      ]}
    />
  )
}
