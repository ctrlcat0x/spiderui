import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud2Preview } from "@/components/docs/previews/logo-cloud-2-preview"

const importCode = `import { LogoCloud2 } from "@/components/ui/logo-cloud-2"`

const usageCode = `const logos = [
  { name: "Vercel", svg: <VercelLogo /> },
  { name: "Stripe", svg: <StripeLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
  { name: "Bolt", svg: <BoltLogo /> },
]

export default function Page() {
  return <LogoCloud2 logos={logos} label="Trusted by teams using" />
}`

export async function LogoCloud2Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-2")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Pass a flat <code className="text-foreground">logos</code> array — the
        component chunks it into groups of three and cycles with spring blur/scale
        transitions via <code className="text-foreground">AnimatePresence</code>.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 2"
      description="Data-driven logo cloud that auto-groups logos and cycles them with spring blur transitions."
      preview={<LogoCloud2Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-2"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-2.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "logos",
          type: "LogoCloud2Item[]",
          description: "Logo entries with a display name and SVG node.",
        },
        {
          name: "label",
          type: "string",
          description: "Optional uppercase heading above the row.",
        },
        {
          name: "duration",
          type: "number",
          default: "2.5",
          description: "Seconds each group stays visible before cycling.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the outer section.",
        },
      ]}
    />
  )
}
