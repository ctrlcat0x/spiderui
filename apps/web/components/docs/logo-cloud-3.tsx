import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud3Preview } from "@/components/docs/previews/logo-cloud-3-preview"

const usageCode = `import { LogosCarousel } from "@/components/ui/logo-cloud-3"

const logos = [
  { name: "Vercel", svg: <VercelLogo /> },
  { name: "Stripe", svg: <StripeLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
  { name: "Linear", svg: <LinearLogo /> },
]

export default function Page() {
  return (
    <LogosCarousel
      logos={logos}
      label="Trusted by leading teams"
      count={3}
      interval={2500}
    />
  )
}`

export async function LogoCloud3Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-3")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="space-y-4">
      <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>
          For provider icons, use{" "}
          <a
            href="https://svgl.app/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-2"
          >
            svgl
          </a>{" "}
          — a library of SVG logos for popular brands and services.
        </p>
      </div>
      <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Logos are split into groups of <code className="text-foreground">count</code> automatically.</li>
        <li>
          After <code className="text-foreground">initialDelay</code> ms the carousel activates and cycles every{" "}
          <code className="text-foreground">interval</code> ms.
        </li>
        <li>
          The outgoing group animates up with blur exit while the incoming group slides in from below.
        </li>
        <li>
          Pure CSS <code className="text-foreground">@keyframes</code> — no animation library required.
        </li>
      </ul>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 3"
      description="CSS-animated logo carousel that cycles groups with vertical blur and slide transitions."
      preview={<LogoCloud3Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-3"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-3.tsx"
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "logos",
          type: "LogoCloud3Item[]",
          description: "Array of logo items to display.",
        },
        {
          name: "label",
          type: "string",
          description: "Optional heading displayed above the carousel.",
        },
        {
          name: "count",
          type: "number",
          default: "4",
          description: "Number of logos to show per group.",
        },
        {
          name: "stagger",
          type: "number",
          default: "0.1",
          description: "Per-item animation stagger delay in seconds.",
        },
        {
          name: "duration",
          type: "number",
          default: "500",
          description: "Duration of each enter/exit animation in milliseconds.",
        },
        {
          name: "interval",
          type: "number",
          default: "2500",
          description: "Time in milliseconds between group cycles.",
        },
        {
          name: "initialDelay",
          type: "number",
          default: "800",
          description: "Delay in milliseconds before the carousel starts animating.",
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
