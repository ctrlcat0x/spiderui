import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud2Preview } from "@/components/docs/previews/logo-cloud-2-preview"

const usageCode = `import { LogoCloud2 } from "@/components/ui/logo-cloud-2"

const logos = [
  { name: "Vercel", svg: <VercelLogo /> },
  { name: "Stripe", svg: <StripeLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
]

export default function Page() {
  return <LogoCloud2 logos={logos} label="Trusted by teams using" />
}`

export async function LogoCloud2Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-2")) ||
    "// Unable to load source code"

  const usageNote = (
    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
      <li>Logos are split into groups of 3 automatically.</li>
      <li>
        Each group cycles on a timer with a spring blur/scale exit and staggered
        blur entrance.
      </li>
      <li>
        Uses{" "}
        <code className="text-foreground">AnimatePresence mode=&quot;popLayout&quot;</code>{" "}
        for smooth cross-fade between groups.
      </li>
    </ul>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 2"
      description="Animated logo cloud that cycles groups of 3 logos with spring blur transitions."
      preview={<LogoCloud2Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-2"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-2.tsx"
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "logos",
          type: "LogoCloud2Item[]",
          description: "Array of logo items to display.",
        },
        {
          name: "label",
          type: "string",
          description: "Optional heading rendered above the logo row.",
        },
        {
          name: "duration",
          type: "number",
          default: "2.5",
          description:
            "Seconds each group of logos stays visible before cycling.",
        },
        {
          name: "className",
          type: "string",
          description: "Extra classes applied to the outer section element.",
        },
      ]}
    />
  )
}
