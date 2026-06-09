import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing002Preview } from "@/components/docs/previews/pricing-002-preview"

const importCode = `import { Pricing002 } from "@/components/ui/pricing-002"`

const usageCode = `export default function Page() {
  return <Pricing002 />
}`

export async function Pricing002Docs() {
  const sourceCode =
    (await readComponentSource("pricing-002")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Requires the shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>{" "}
      registry item. CTAs use native{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        &lt;a&gt;
      </code>{" "}
      tags with <code className="text-foreground">Button asChild</code> — swap for{" "}
      <code className="text-foreground">&lt;Link&gt;</code> in Next.js if you prefer
      client navigation.
    </p>
  )

  return (
    <DocsPageLayout
      title="Pricing 002"
      description="Three-column pricing with a gradient-bordered featured card and illustrated cursor decoration."
      preview={<Pricing002Preview />}
      previewCode={usageCode}
      installPackageName="pricing-002"
      installDependencies="@hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-002.tsx"
      installationNote={installationNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      scrollablePreview
      props={[
        {
          name: "plans",
          type: "Plan2[]",
          default: "DEFAULT_PLANS_2",
          description:
            "Plan objects with price, features, CTA link, optional footnote, and featured flag.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the grid container.",
        },
      ]}
    />
  )
}
