import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing006Preview } from "@/components/docs/previews/pricing-006-preview"

const importCode = `import { Pricing006 } from "@/components/ui/pricing-006"`

const usageCode = `export default function Page() {
  return <Pricing006 />
}`

export async function Pricing006Docs() {
  const sourceCode =
    (await readComponentSource("pricing-006")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Requires shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>{" "}
      registry item.
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Two-column split pricing with a header label, per-plan title and price
        rows, icon feature lists, and shadcn buttons — secondary on the left
        plan, default on the right. Set{" "}
        <code className="text-foreground">featured</code> and{" "}
        <code className="text-foreground">featuredLabel</code> on the right plan
        to show the &quot;Most popular&quot; badge.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Pricing 006"
      description="Split two-plan pricing with header label, icon feature rows, and a most-popular badge."
      preview={<Pricing006Preview />}
      previewCode={usageCode}
      installPackageName="pricing-006"
      installDependencies="@hugeicons/core-free-icons @hugeicons/react clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-006.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      scrollablePreview
      props={[
        {
          name: "plans",
          type: "Plan6[]",
          default: "DEFAULT_PLANS_6",
          description:
            "Two plan objects with name, price, icon features, CTA, and optional featured badge.",
        },
        {
          name: "title",
          type: "string",
          default: '"Start free. Scale confidently."',
          description: "Header label above the split plan grid.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the root section.",
        },
      ]}
    />
  )
}
