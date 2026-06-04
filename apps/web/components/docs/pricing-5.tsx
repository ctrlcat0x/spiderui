import React from "react"
import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing5Preview } from "@/components/docs/previews/pricing-5-preview"

const usageCode = `import { Pricing5 } from "@/components/ui/pricing-5"

export default function Page() {
  return <Pricing5 />
}`

const customizeCode = `import { Pricing5, type Plan5 } from "@/components/ui/pricing-5"

const myPlans: Plan5[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Everything you need to get started.",
    palette: "blue",
    originalPrice: "$199",
    price: "$99",
    priceNote: "One-time payment",
    ctaLabel: "Buy now",
    ctaHref: "/checkout/starter",
    features: ["5 projects", "Email support", "Access to all components"],
  },
]

export default function Page() {
  return <Pricing5 individualPlans={myPlans} teamsPlans={myPlans} />
}`

export async function Pricing5Docs() {
  const sourceCode =
    (await readComponentSource("pricing-5")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Depends on shadcn{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        button
      </code>
      , the Spider UI{" "}
      <Link
        href="/docs/components/primitives/avatar"
        className="font-medium text-foreground underline underline-offset-4"
      >
        Avatar
      </Link>{" "}
      component (installed automatically as a registry dependency), and Hugeicons.
    </p>
  )

  const usageNote = (
    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
      <li>
        A pill tab switcher toggles between <code className="text-foreground">individualPlans</code> and <code className="text-foreground">teamsPlans</code>.
      </li>
      <li>
        Each card header uses coloured blobs, an SVG grain overlay, and an <code className="text-foreground">Avatar</code> orb matched to the palette.
      </li>
      <li>
        <code className="text-foreground">featuredLabel</code> renders as a frosted pill beside the avatar; <code className="text-foreground">ctaDark</code> uses a foreground-filled CTA.
      </li>
      <li>Features render with a tick icon from Hugeicons.</li>
    </ul>
  )

  return (
    <DocsPageLayout
      title="Pricing 5"
      description="Tabbed individuals/teams pricing grid with coloured card backdrops, Avatar orbs, grain texture overlays, and feature checklists."
      preview={<Pricing5Preview />}
      previewCode={usageCode}
      installPackageName="pricing-5"
      installDependencies="clsx tailwind-merge @hugeicons/react @hugeicons/core-free-icons motion"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-5.tsx"
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
      fullWidthPreview
      scrollablePreview
      props={[
        {
          name: "individualPlans",
          type: "Plan5[]",
          default: "INDIVIDUALS_PLANS_5",
          description: "Plans shown in the Individuals tab.",
        },
        {
          name: "teamsPlans",
          type: "Plan5[]",
          default: "TEAMS_PLANS_5",
          description: "Plans shown in the Teams tab.",
        },
        {
          name: "individualsLabel",
          type: "string",
          default: '"Individuals"',
          description: "Label for the individuals tab button.",
        },
        {
          name: "teamsLabel",
          type: "string",
          default: '"Teams & Enterprise"',
          description: "Label for the teams tab button.",
        },
        {
          name: "defaultTab",
          type: '"individuals" | "teams"',
          default: '"individuals"',
          description: "Which tab is active on first render.",
        },
        {
          name: "title",
          type: "string",
          default: '"Simple, transparent pricing"',
          description: "Section heading.",
        },
        {
          name: "subtitle",
          type: "string",
          default: '"No hidden fees. Choose the plan that works for you."',
          description: "Section subheading.",
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
