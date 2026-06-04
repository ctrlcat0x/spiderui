import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing3Preview } from "@/components/docs/previews/pricing-3-preview"

const usageCode = `import { Pricing3 } from "@/components/ui/pricing-3"

export default function Page() {
  return <Pricing3 />
}`

const customizeCode = `import { Pricing3 } from "@/components/ui/pricing-3"

export default function Page() {
  return (
    <Pricing3
      title="Plans for every team"
      subtitle="Start free and scale as you grow."
    />
  )
}`

export async function Pricing3Docs() {
  const sourceCode =
    (await readComponentSource("pricing-3")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Depends on shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>{" "}
      and{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        badge
      </code>{" "}
      registry items (badge includes an <code className="text-foreground">amber</code> variant).
    </p>
  )

  const usageNote = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Inspired by{" "}
        <a
          href="https://efferd.com/view/pricing-6"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Efferd Pricing 6
        </a>
        .
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Plans are split into hobby (first non-featured), featured center column, and enterprise (second non-featured).
        </li>
        <li>
          Featured column uses <code className="text-foreground">bg-muted/50</code> with an elevated inner card.
        </li>
        <li>
          <code className="text-foreground">customPricing</code> swaps the price row for an icon + label layout.
        </li>
        <li>
          <code className="text-foreground">footerNote</code> renders a security icon row below the featured card.
        </li>
      </ul>
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs">
        <code>{customizeCode}</code>
      </pre>
    </div>
  )

  return (
    <DocsPageLayout
      title="Pricing 3"
      description="Asymmetric three-column pricing layout with an elevated featured plan card, amber badge, and a security footer note."
      preview={<Pricing3Preview />}
      previewCode={usageCode}
      installPackageName="pricing-3"
      installDependencies="@hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-3.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "plans",
          type: "Plan3[]",
          default: "DEFAULT_PLANS_3",
          description: "Array of pricing plans.",
        },
        {
          name: "title",
          type: "string",
          default: '"Flexible plans that grow with you"',
          description: "Section heading.",
        },
        {
          name: "subtitle",
          type: "string",
          default: "DEFAULT_PRICING_3_SUBTITLE",
          description: "Section subtitle shown opposite the heading.",
        },
        {
          name: "className",
          type: "string",
          description: "Extra classes applied to the root container.",
        },
      ]}
    />
  )
}
