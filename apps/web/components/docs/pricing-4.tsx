import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing4Preview } from "@/components/docs/previews/pricing-4-preview"

const usageCode = `import { Pricing4 } from "@/components/ui/pricing-4"

export default function Page() {
  return <Pricing4 />
}`

const customizeCode = `import { Pricing4, type Plan4 } from "@/components/ui/pricing-4"

const plans: Plan4[] = [
  {
    id: "starter",
    name: "Starter",
    features: ["5 projects", "10 GB storage", "Email support"],
    price: "$9/month",
    ctaLabel: "Get started",
    ctaHref: "/checkout/starter",
    accent: "blue",
  },
  {
    id: "pro",
    name: "Pro",
    features: ["Unlimited projects", "100 GB storage", "Priority support"],
    originalPrice: "$29",
    price: "$19/month",
    ctaLabel: "Start free trial",
    ctaHref: "/checkout/pro",
    recommended: true,
    accent: "violet",
  },
]

export default function Page() {
  return (
    <Pricing4
      plans={plans}
      title="Choose your plan"
      subtitle="Cancel any time."
    />
  )
}`

export async function Pricing4Docs() {
  const sourceCode =
    (await readComponentSource("pricing-4")) ||
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
      registry items.
    </p>
  )

  const usageNote = (
    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
      <li>
        Each plan is a horizontal card with a gradient accent blob and pricing + CTA on the right.
      </li>
      <li>
        <code className="text-foreground">originalPrice</code> renders with line-through next to the current price.
      </li>
      <li>
        <code className="text-foreground">recommended</code> adds a badge beside the plan name.
      </li>
      <li>
        <code className="text-foreground">accent</code> controls the blob gradient (neutral, orange, blue, violet, emerald, rose, yellow).
      </li>
    </ul>
  )

  return (
    <DocsPageLayout
      title="Pricing 4"
      description="Horizontal list-style pricing layout with accent icon blobs, strikethrough original prices, and optional recommended badge."
      preview={<Pricing4Preview />}
      previewCode={usageCode}
      installPackageName="pricing-4"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-4.tsx"
      installationNote={installationNote}
      usageNote={
        <div className="space-y-4">
          {usageNote}
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs">
            <code>{customizeCode}</code>
          </pre>
        </div>
      }
      usageCode={usageCode}
      props={[
        {
          name: "plans",
          type: "Plan4[]",
          default: "DEFAULT_PLANS_4",
          description: "Array of plan objects to render.",
        },
        {
          name: "title",
          type: "string",
          default: '"Organize without limits"',
          description: "Header title above the plan list.",
        },
        {
          name: "subtitle",
          type: "string",
          default: '"Local or cloud — your choice"',
          description: "Subtitle below the header.",
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
