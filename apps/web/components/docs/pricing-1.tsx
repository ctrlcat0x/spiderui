import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing1Preview } from "@/components/docs/previews/pricing-1-preview"

const importCode = `import { Pricing1 } from "@/components/ui/pricing-1"`

const usageCode = `export default function Page() {
  return <Pricing1 />
}`

export async function Pricing1Docs() {
  const sourceCode =
    (await readComponentSource("pricing-1")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Requires the shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>{" "}
      registry item. The install command adds{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        react-use-measure
      </code>{" "}
      for the sliding price digits.
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Three-column grid with a monthly/yearly toggle. Prices animate through{" "}
        <code className="text-foreground">SlidingNumber</code> (motion springs +{" "}
        <code className="text-foreground">react-use-measure</code>). Featured plans get{" "}
        <code className="text-foreground">CornerPlus</code> border decorations.
        Inspired by{" "}
        <a
          href="https://efferd.com/view/pricing-7"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Efferd Pricing 7
        </a>
        .
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Pricing 1"
      description="Animated pricing grid with sliding digit prices, yearly billing toggle, and featured plan corner accents."
      preview={<Pricing1Preview />}
      previewCode={usageCode}
      installPackageName="pricing-1"
      installDependencies="motion react-use-measure @hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-1.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      scrollablePreview
      props={[
        {
          name: "plans",
          type: "Plan[]",
          default: "DEFAULT_PLANS",
          description:
            "Plan objects with monthly/yearly prices, features, credits label, and featured flag.",
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
