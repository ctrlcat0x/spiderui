import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing3Preview } from "@/components/docs/previews/pricing-3-preview"

const importCode = `import { Pricing3 } from "@/components/ui/pricing-3"`

const usageCode = `export default function Page() {
  return <Pricing3 />
}`

export async function Pricing3Docs() {
  const sourceCode =
    (await readComponentSource("pricing-3")) ||
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
      (uses the <code className="text-foreground">amber</code> variant on the featured
      plan).
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Asymmetric three-column layout: hobby, elevated featured center, and enterprise.
        Set <code className="text-foreground">customPricing</code> to swap the price row
        for a label, and <code className="text-foreground">footerNote</code> for a
        security row under the featured card. Inspired by{" "}
        <a
          href="https://efferd.com/view/pricing-6"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Efferd Pricing 6
        </a>
        .
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Pricing 3"
      description="Asymmetric three-column pricing with an elevated featured card, amber badge, and optional security footer."
      preview={<Pricing3Preview />}
      previewCode={usageCode}
      installPackageName="pricing-3"
      installDependencies="@hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-3.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      scrollablePreview
      props={[
        {
          name: "plans",
          type: "Plan3[]",
          default: "DEFAULT_PLANS_3",
          description:
            "Plan objects with price or customPricing, features, CTA, featured flag, and optional footerNote.",
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
          description: "Subtitle opposite the heading.",
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
