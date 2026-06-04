import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing1Preview } from "@/components/docs/previews/pricing-1-preview"

const usageCode = `import { Pricing1 } from "@/components/ui/pricing-1"

export default function Page() {
  return <Pricing1 />
}`

export async function Pricing1Docs() {
  const sourceCode =
    (await readComponentSource("pricing-1")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      This component depends on the shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>{" "}
      registry item. The install command adds{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        react-use-measure
      </code>{" "}
      automatically.
    </p>
  )

  const usageNote = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Inspired by{" "}
        <a
          href="https://efferd.com/view/pricing-7"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Efferd Pricing 7
        </a>
        .
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <code className="text-foreground">motion/react</code> springs and{" "}
          <code className="text-foreground">react-use-measure</code> animate digit slots in{" "}
          <code className="text-foreground">SlidingNumber</code> when toggling billing.
        </li>
        <li>
          The yearly switch updates each plan&apos;s <code className="text-foreground">monthly</code> vs{" "}
          <code className="text-foreground">yearly</code> price.
        </li>
        <li>
          Featured plans show <code className="text-foreground">CornerPlus</code> decorations on the shared border grid.
        </li>
        <li>Feature rows use Hugeicons check badges.</li>
      </ul>
    </div>
  )

  return (
    <DocsPageLayout
      title="Pricing 1"
      description="Modern pricing grid with animated sliding numbers, yearly billing toggle, and featured plan corner decorations."
      preview={<Pricing1Preview />}
      previewCode={usageCode}
      installPackageName="pricing-1"
      installDependencies="motion react-use-measure @hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-1.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "plans",
          type: "Plan[]",
          default: "DEFAULT_PLANS",
          description: "Array of pricing plans to display.",
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
