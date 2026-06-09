import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Pricing5Preview } from "@/components/docs/previews/pricing-5-preview"

const importCode = `import { Pricing5 } from "@/components/ui/pricing-5"`

const usageCode = `export default function Page() {
  return <Pricing5 />
}`

export async function Pricing5Docs() {
  const sourceCode =
    (await readComponentSource("pricing-5")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Requires shadcn{" "}
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
      component (installed as a registry dependency), and Hugeicons.
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Pill tab switcher toggles <code className="text-foreground">individualPlans</code>{" "}
        vs <code className="text-foreground">teamsPlans</code>. Each card uses coloured
        blobs, SVG grain, and an <code className="text-foreground">Avatar</code> orb
        matched to the palette. Set <code className="text-foreground">featuredLabel</code>{" "}
        for a frosted pill and <code className="text-foreground">ctaDark</code> for a
        filled CTA.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Pricing 5"
      description="Tabbed individuals/teams pricing with coloured card backdrops, Avatar orbs, and grain texture overlays."
      preview={<Pricing5Preview />}
      previewCode={usageCode}
      installPackageName="pricing-5"
      installDependencies="clsx tailwind-merge @hugeicons/react @hugeicons/core-free-icons motion"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/pricing-5.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
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
          description: "Label for the individuals tab.",
        },
        {
          name: "teamsLabel",
          type: "string",
          default: '"Teams & Enterprise"',
          description: "Label for the teams tab.",
        },
        {
          name: "defaultTab",
          type: '"individuals" | "teams"',
          default: '"individuals"',
          description: "Active tab on first render.",
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
          description: "Classes on the root container.",
        },
      ]}
    />
  )
}
