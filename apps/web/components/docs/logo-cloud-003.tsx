import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud003Preview } from "@/components/docs/previews/logo-cloud-003-preview"

const importCode = `import { LogosCarousel } from "@/components/ui/logo-cloud-003"`

const usageCode = `const logos = [
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

export async function LogoCloud003Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-003")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Pure CSS <code className="text-foreground">@keyframes</code> — no animation
        library. Logos split into groups of <code className="text-foreground">count</code>;
        outgoing groups slide up with blur while incoming groups rise from below.
      </p>
      <p>
        SVG logos:{" "}
        <a
          href="https://svgl.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          svgl
        </a>
        .
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 003"
      description="CSS-only logo carousel with vertical slide, blur enter/exit, and configurable group size."
      preview={<LogoCloud003Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-003"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-003.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "logos",
          type: "LogoCloud003Item[]",
          description: "Logo entries with a display name and SVG node.",
        },
        {
          name: "label",
          type: "string",
          description: "Optional heading above the carousel.",
        },
        {
          name: "count",
          type: "number",
          default: "4",
          description: "Logos shown per group.",
        },
        {
          name: "stagger",
          type: "number",
          default: "0.1",
          description: "Per-item animation stagger in seconds.",
        },
        {
          name: "duration",
          type: "number",
          default: "500",
          description: "Enter/exit animation duration in milliseconds.",
        },
        {
          name: "interval",
          type: "number",
          default: "2500",
          description: "Milliseconds between group cycles.",
        },
        {
          name: "initialDelay",
          type: "number",
          default: "800",
          description: "Milliseconds before the carousel starts cycling.",
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
